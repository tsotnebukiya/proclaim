export const claimContract = `contract ClaimsContract {
    string public name;
    address public owner;
    IBankDepository public bankDepository;
    mapping(string => address) private tokenAddresses;

    struct Claim {
        string encryptedClaimData;
        uint256 amountOwed;
        bool isSettled;
        address counterpartyAddress;
        string tokenName;
    }

    mapping(bytes32 => Claim) public claims;
    bytes32[] public claimHashes;

    event ClaimAdded(bytes32 indexed claimIdentifier, address indexed counterpartyAddress);
    event ClaimSettled(bytes32 indexed claimIdentifier, address indexed counterpartyAddress);
    event SettlementError(bytes32 indexed claimIdentifier, address indexed counterpartyAddress, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action.");
        _;
    }

    modifier onlyCounterparty(bytes32 claimIdentifier) {
        require(msg.sender == claims[claimIdentifier].counterpartyAddress, "Only the specified counterparty can settle this claim.");
        _;
    }

    constructor(
        address depositoryContractAddress, 
        string memory market, 
        uint accountNumber, 
        string memory publicKey,
        string memory contractName
        ) {
        owner = msg.sender;
        bankDepository = IBankDepository(depositoryContractAddress);
        bankDepository.registerBank(market, accountNumber, owner, address(this), publicKey, contractName);
        tokenAddresses["USDt"] = bankDepository.getTokenAddress("USDt");
        tokenAddresses["EURt"] = bankDepository.getTokenAddress("EURt");
        name = contractName;
    }
    
    function addClaims(
        bytes32[] memory claimIdentifiers,
        string[] memory encryptedClaimDatas,
        uint256[] memory amountsOwed,
        address[] memory counterpartyAddresses,
        string[] memory tokenNames
        ) public onlyOwner {
        require(
            claimIdentifiers.length == encryptedClaimDatas.length &&
            claimIdentifiers.length == amountsOwed.length &&
            claimIdentifiers.length == counterpartyAddresses.length &&
            claimIdentifiers.length == tokenNames.length,
            "Array lengths must match"
        );

        for (uint i = 0; i < claimIdentifiers.length; i++) {
             if (claims[claimIdentifiers[i]].counterpartyAddress != address(0)) {
            continue;
        }
            claims[claimIdentifiers[i]] = Claim({
                encryptedClaimData: encryptedClaimDatas[i],
                amountOwed: amountsOwed[i],
                isSettled: false,
                counterpartyAddress: counterpartyAddresses[i],
                tokenName: tokenNames[i]
            });
            claimHashes.push(claimIdentifiers[i]);
            emit ClaimAdded(claimIdentifiers[i], counterpartyAddresses[i]);
        }
    }

    function addClaim(
        bytes32 claimIdentifier,
        string memory encryptedClaimData,
        uint256 amountOwed,
        address counterpartyAddress,
        string memory tokenName
        ) public onlyOwner {
        require(claims[claimIdentifier].counterpartyAddress == address(0), "Claim already exists.");

        claims[claimIdentifier] = Claim({
            encryptedClaimData: encryptedClaimData,
            amountOwed: amountOwed,
            isSettled: false,
            counterpartyAddress: counterpartyAddress,
            tokenName: tokenName
        });

        claimHashes.push(claimIdentifier);
        emit ClaimAdded(claimIdentifier, counterpartyAddress);
    }


    function settleClaims(bytes32[] calldata claimIdentifiers) external {
        for (uint i = 0; i < claimIdentifiers.length; i++) {
        bytes32 claimIdentifier = claimIdentifiers[i];
        Claim storage claim = claims[claimIdentifier];

        if (claim.isSettled) {
            emit SettlementError(claimIdentifier, msg.sender, "Claim already settled.");
            continue; // Skip already settled claims
        }

        if (claim.counterpartyAddress != msg.sender) {
            emit SettlementError(claimIdentifier, msg.sender, "Caller is not the counterparty.");
            continue; // Skip if caller is not the counterparty
        }

        address tokenAddress = tokenAddresses[claim.tokenName];

        if (tokenAddress == address(0)) {
            emit SettlementError(claimIdentifier, msg.sender, "Unsupported token");
            continue; // Skip unsupported tokens
        }

        IToken token = IToken(tokenAddress);

        if (!token.isApproved(msg.sender, address(this))) {
            emit SettlementError(claimIdentifier, msg.sender, "BankContract not approved to transfer tokens.");
            continue;
        }

        uint256 balance = token.balanceOf(msg.sender);

        if (balance < claim.amountOwed) {
            if (keccak256(bytes(claim.tokenName)) == keccak256(bytes("USDt"))) {
                emit SettlementError(claimIdentifier, msg.sender, "Insufficient USDt balance for some claims.");
            } else if (keccak256(bytes(claim.tokenName)) == keccak256(bytes("EURt"))) {
                emit SettlementError(claimIdentifier, msg.sender, "Insufficient EURt balance for some claims.");
            }
            continue;
        }

        bool success = token.transferFrom(msg.sender, owner, claim.amountOwed);

        if (!success) {
            emit SettlementError(claimIdentifier, msg.sender, "Token transfer failed");
            continue;
        }

        claim.isSettled = true;
        emit ClaimSettled(claimIdentifier, msg.sender);
        }
    }
    
    function settleClaim(bytes32 claimIdentifier) external onlyCounterparty(claimIdentifier){
        Claim storage claim = claims[claimIdentifier];
        // Check if the claim has already been settled or if the caller is not the counterparty
        require(!claim.isSettled, "This claim has already been settled.");

        address tokenAddress = tokenAddresses[claim.tokenName];
        require(tokenAddress != address(0), "Unsupported token");

        IToken token = IToken(tokenAddress);
        require(token.isApproved(msg.sender, address(this)), "CitiClaims not approved to transfer tokens.");
    
        uint256 balance = token.balanceOf(msg.sender);
    
        if (balance < claim.amountOwed) {
            // Emit a specific error based on the token type
            if (keccak256(bytes(claim.tokenName)) == keccak256(bytes("USDt"))) {
                emit SettlementError(claimIdentifier, msg.sender, "Insufficient USDt balance.");
            } else if (keccak256(bytes(claim.tokenName)) == keccak256(bytes("EURt"))) {
                emit SettlementError(claimIdentifier, msg.sender, "Insufficient EURt balance.");
            }
            return;
        }

        bool success = token.transferFrom(msg.sender,owner, claim.amountOwed);
        require(success, "Token transfer failed");

        claim.isSettled = true;
        emit ClaimSettled(claimIdentifier, msg.sender);
    }

    function checkIfSettled(bytes32 claimIdentifier) external view returns (bool) {
        return claims[claimIdentifier].isSettled;
    }

    function getClaims() public view returns (
        bytes32[] memory ids, 
        string[] memory encryptedData, 
        uint256[] memory amounts, 
        bool[] memory settledStatus, 
        address[] memory counterparties, 
        string[] memory tokenNames // Added token names to the return values
        ) {
        uint256 totalClaims = claimHashes.length;
        ids = new bytes32[](totalClaims);
        encryptedData = new string[](totalClaims);
        amounts = new uint256[](totalClaims);
        settledStatus = new bool[](totalClaims);
        counterparties = new address[](totalClaims);
        tokenNames = new string[](totalClaims); // Initialize the array for token names

        for (uint256 i = 0; i < totalClaims; i++) {
            bytes32 id = claimHashes[i];
            Claim storage claim = claims[id];
            ids[i] = id;
            encryptedData[i] = claim.encryptedClaimData;
            amounts[i] = claim.amountOwed;
            settledStatus[i] = claim.isSettled;
            counterparties[i] = claim.counterpartyAddress;
            tokenNames[i] = claim.tokenName;
        }

        return (ids, encryptedData, amounts, settledStatus, counterparties, tokenNames);
    }

    function getSettledClaims() public view returns (
        bytes32[] memory ids, 
        string[] memory encryptedData, 
        uint256[] memory amounts, 
        address[] memory counterparties, 
        string[] memory tokenNames
        ) {
        uint256 count = 0;
        // Count settled claims for array initialization
        for (uint256 i = 0; i < claimHashes.length; i++) {
            if (claims[claimHashes[i]].isSettled) {
                count++;
            }
        }

        ids = new bytes32[](count);
        encryptedData = new string[](count);
        amounts = new uint256[](count);
        counterparties = new address[](count);
        tokenNames = new string[](count);
    
        uint256 j = 0;
        for (uint256 i = 0; i < claimHashes.length; i++) {
            if (claims[claimHashes[i]].isSettled) {
                ids[j] = claimHashes[i];
                encryptedData[j] = claims[claimHashes[i]].encryptedClaimData;
                amounts[j] = claims[claimHashes[i]].amountOwed;
                counterparties[j] = claims[claimHashes[i]].counterpartyAddress;
                tokenNames[j] = claims[claimHashes[i]].tokenName;
                j++;
            }
        }
    
        return (ids, encryptedData, amounts, counterparties, tokenNames);
    }

    function getUnsettledClaims() public view returns (
        bytes32[] memory ids, 
        string[] memory encryptedData, 
        uint256[] memory amounts, 
        address[] memory counterparties, 
        string[] memory tokenNames
        ) {
        uint256 count = 0;
        // Count unsettled claims for array initialization
        for (uint256 i = 0; i < claimHashes.length; i++) {
            if (!claims[claimHashes[i]].isSettled) {
                count++;
            }
        }

        ids = new bytes32[](count);
        encryptedData = new string[](count);
        amounts = new uint256[](count);
        counterparties = new address[](count);
        tokenNames = new string[](count);

        uint256 j = 0;
        for (uint256 i = 0; i < claimHashes.length; i++) {
            if (!claims[claimHashes[i]].isSettled) {
                ids[j] = claimHashes[i];
                encryptedData[j] = claims[claimHashes[i]].encryptedClaimData;
                amounts[j] = claims[claimHashes[i]].amountOwed;
                counterparties[j] = claims[claimHashes[i]].counterpartyAddress;
                tokenNames[j] = claims[claimHashes[i]].tokenName;
                j++;
            }
        }

        return (ids, encryptedData, amounts, counterparties, tokenNames);
    }

    function getClaim(bytes32 claimIdentifier) public view returns (
        string memory encryptedClaimData, 
        uint256 amountOwed, 
        bool isSettled, 
        address counterpartyAddress, 
        string memory tokenName
        ) {
        Claim storage claim = claims[claimIdentifier];
        return (
            claim.encryptedClaimData, 
            claim.amountOwed, 
            claim.isSettled, 
            claim.counterpartyAddress,
            claim.tokenName
        );
    }

}`;

export const depositoryContract = `contract BankDepository {
  string public constant name = "BankDepository";
  address public admin;
  mapping(string => address) public tokenAddresses;

  struct BankDetails {
      string market;
      uint accountNumber;
      address ethAddress;
      address contractAddress;
      string publicKey;
      string teamName;
  }

  mapping(string => BankDetails) public bankRegistry;
  mapping(address => bool) private registeredContractAddresses;
  string[] public allKeys;

  event BankRegistered(string indexed key, address ethAddress, address contractAddress, string publicKey);

  constructor(address usdtAddress, address eurtAddress) {
      admin = msg.sender;
      tokenAddresses["USDt"] = usdtAddress;
      tokenAddresses["EURt"] = eurtAddress;
  }

  function getTokenAddress(string memory tokenName) external view returns (address) {
      return tokenAddresses[tokenName];
  }
  
  function generateKey(string memory market, uint accountNumber) internal pure returns (string memory) {
      return string(abi.encodePacked(market, '_', Strings.toString(accountNumber)));
  }

  function registerBank(string memory market, uint _accountNumber, address _ethAddress, address _contractAddress, string memory _publicKey, string memory _teamName) external {
      require(_contractAddress == address(0) || !registeredContractAddresses[_contractAddress], "Contract address already registered or invalid.");
      string memory key = generateKey(market, _accountNumber);
      require(bankRegistry[key].ethAddress == address(0), "Bank already registered with this market and account number.");

      BankDetails memory newBank = BankDetails({
          market: market,
          accountNumber: _accountNumber,
          ethAddress: _ethAddress,
          contractAddress: _contractAddress,
          publicKey: _publicKey,
          teamName: _teamName
      });

      bankRegistry[key] = newBank;
      if (_contractAddress != address(0)) {
          registeredContractAddresses[_contractAddress] = true;
      }
      allKeys.push(key);

      emit BankRegistered(key, _ethAddress, _contractAddress, _publicKey);
  }

  function getBankDetails(string memory market, uint _accountNumber) external view returns (BankDetails memory) {
      string memory key = generateKey(market, _accountNumber);
      require(bankRegistry[key].ethAddress != address(0), "Bank not registered.");
      return bankRegistry[key];
  }

  function getAllBankDetails() external view returns (BankDetails[] memory) {
      BankDetails[] memory details = new BankDetails[](allKeys.length);
      for (uint i = 0; i < allKeys.length; i++) {
          string memory key = allKeys[i];
          BankDetails storage detail = bankRegistry[key];
          details[i] = detail;
      }
      return details;
  }
}`;

export const tokenContract = `contract StableCoin {
  string public constant name = "USDtToken";
  string public constant symbol = "USDt";
  uint8 public constant decimals = 2;

  mapping(address => uint256) private balances;
  mapping(address => mapping(address => bool)) private allowed;

  uint256 private totalSupply_;
  address public owner;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, bool isAllowed);

  constructor() {
      owner = msg.sender;
  }

  modifier onlyOwner() {
      require(msg.sender == owner, "Only the owner can perform this action");
      _;
  }

  function totalSupply() public view returns (uint256) {
      return totalSupply_;
  }

  function balanceOf(address account) public view returns (uint256) {
      return balances[account];
  }

  function transfer(address recipient, uint256 amount) public returns (bool) {
      require(amount <= balances[msg.sender], "Insufficient balance");
      balances[msg.sender] = balances[msg.sender] - amount;
      balances[recipient] = balances[recipient] + amount;
      emit Transfer(msg.sender, recipient, amount);
      return true;
  }

  function approve(address spender) public returns (bool) {
      allowed[msg.sender][spender] = true;
      emit Approval(msg.sender, spender, true);
      return true;
  }
  
  function disapprove(address spender) public returns (bool) {
      allowed[msg.sender][spender] = false;
      emit Approval(msg.sender, spender, false);
      return true;
  }

  function isApproved(address _owner, address _spender) public view returns (bool) {
      return allowed[_owner][_spender];
  }

  
  function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
      require(allowed[sender][msg.sender], "Not allowed to spend");
      require(amount <= balances[sender], "Insufficient balance");

      balances[sender] -= amount;
      balances[recipient] += amount;
      emit Transfer(sender, recipient, amount);
      return true;
  }

 function mint(address recipient, uint256 amount) public onlyOwner {
      require(recipient != address(0), "Cannot mint to the zero address");
      totalSupply_ += amount;
      balances[recipient] += amount;
      emit Transfer(address(0), recipient, amount);
  }
}
`;
