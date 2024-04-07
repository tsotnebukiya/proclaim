// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@thirdweb-dev/contracts/lib/Strings.sol";

contract BankDepository {
    string public constant name = "BankDepository";
    address public admin;
    mapping(string => address) public tokenAddresses;

    struct BankDetails {
        string market;
        uint accountNumber;
        address ethAddress;
        address contractAddress;
        string publicKey;
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

    function registerBank(string memory market, uint _accountNumber, address _ethAddress, address _contractAddress, string memory _publicKey) external {
        require(_contractAddress == address(0) || !registeredContractAddresses[_contractAddress], "Contract address already registered or invalid.");
        string memory key = generateKey(market, _accountNumber);
        require(bankRegistry[key].ethAddress == address(0), "Bank already registered with this market and account number.");

        BankDetails memory newBank = BankDetails({
            market: market,
            accountNumber: _accountNumber,
            ethAddress: _ethAddress,
            contractAddress: _contractAddress,
            publicKey: _publicKey
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
}