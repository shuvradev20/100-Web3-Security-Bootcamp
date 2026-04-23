// SPDX-License-Identifier: MIT
pragma solidity ^0.8.32;

contract CrowdfundingVault {
    address payable public owner;
    uint256 public fundingGoal;
    uint256 public totalFunded;
    uint32 public deadline;

    error Unauthorized(); //
    error StillActive(); //
    error GoalNotMet(); //
    error GoalReached(); //
    error TransferFailed();
    error Expired(); //
    error NoFundsToRefund();

    mapping (address => uint256) public funds;

    event Claim(uint256 amount);
    event Refund(address indexed donor, uint256 amount);

    constructor(uint256 _goal) {
        fundingGoal = _goal;
        deadline = uint32(block.timestamp + 7 days);
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        if(msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    function deposit() external payable {
        if(block.timestamp > deadline){
            revert Expired();
        }

        funds[msg.sender] += msg.value;
        totalFunded += msg.value;
    }

    function claim() external onlyOwner {
        if(block.timestamp < deadline) {
            revert StillActive();
        }

        if(totalFunded < fundingGoal) {
            revert GoalNotMet();
        }

        uint256 amountToClaim = address(this).balance;

        totalFunded = 0; 

        (bool success, ) = owner.call{value: amountToClaim}("");
        if(success == false) {
            revert TransferFailed();
        }

        emit Claim(amountToClaim);
    }

    function refund() external {
       if(block.timestamp < deadline){
            revert StillActive();
       }

       if(totalFunded >= fundingGoal){
            revert GoalReached();
       }

       uint256 refundAmount = funds[msg.sender];

       if(refundAmount == 0){
            revert NoFundsToRefund();
       } 

       funds[msg.sender] = 0;

       (bool success, ) = msg.sender.call{value: refundAmount}("");
       if(!success) revert TransferFailed();

       emit Refund(msg.sender, refundAmount);
    }
}