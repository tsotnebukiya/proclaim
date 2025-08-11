// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IBankDepository {
    function getTokenAddress(string memory tokenName) external view returns (address);
    function registerBank(string memory market, uint accountNumber, address ethAddress, address contractAddress, string memory publicKey, string memory teamName) external;
}

interface IToken {
    function balanceOf(address account) external view returns (uint256);
    function isApproved(address _owner, address _spender) external view returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract ClaimsContract {
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

}