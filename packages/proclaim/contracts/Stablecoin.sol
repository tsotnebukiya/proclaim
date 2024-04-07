// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EURtToken {
    string public constant name = "EURt Token";
    string public constant symbol = "EURt";
    uint8 public constant decimals = 2;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => bool)) private allowed;

    uint256 private totalSupply_;
    address public owner;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, bool isAllowed);

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
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
