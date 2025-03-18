// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";

contract StakeIt is Ownable {
    constructor() Ownable(msg.sender) {}

    uint256 public constant MINIMUM_STAKE = 0 wei;

    struct User {
        uint256 stakedAmount;
        string username;
        bool isActive;

    }

    mapping(address => User) public users;

     event AcoountCreated(address indexed user, string username, uint256 stakedAmount);
    event AccountWithdrawnAndDeactivated ( address indexed user, uint256 amount);


    function createAccount (string calldata _userName) external payable {
           require(!users[msg.sender].isActive, "Account already exists");
           require(msg.value >= MINIMUM_STAKE, " Insufficient stake Amount" );
           users[msg.sender] = User({
            stakedAmount : msg.value,
            username : _userName,
            isActive : true
           });

           emit AcoountCreated( msg.sender, _userName, msg.value);
    }

    function withdrawAndDeactivate() external  {
        require(users[msg.sender].isActive,"No active Account");

        uint256 amount = users[msg.sender].stakedAmount;

        require(amount > 0 , " No stake to withdraw");
        
        users[msg.sender].stakedAmount = 0;
        users[msg.sender].isActive = false;

        emit AccountWithdrawnAndDeactivated(msg.sender, amount);

        payable (msg.sender).transfer(amount);

    } 

    receive() external payable { }
}