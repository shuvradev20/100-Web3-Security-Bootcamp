// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.32;

contract TimeLockVault {
    error Unauthorized();
    error TimeLockActive();
    error TransferFailed();

    address payable public owner;

    struct WithdrawalRequest {
        uint96 amount;
        uint64 unlockTime;
    }

    WithdrawalRequest public currentRequest;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        if (msg.sender != owner)
            revert Unauthorized();
        _;
    }

    receive() external payable { }

    function queueWithdrawal(uint96 _amount) external onlyOwner {
        currentRequest.amount = _amount;
        currentRequest.unlockTime = uint64(block.timestamp + 3 days);
    }

    function executeWithdrawal() external onlyOwner {
        if(block.timestamp < currentRequest.unlockTime){
            revert TimeLockActive();
        }

        uint96 tempAmount = currentRequest.amount;

        currentRequest.amount = 0;
        currentRequest.unlockTime = 0;

        (bool success, ) = owner.call{value: tempAmount}("");
        if(!success) {
            revert TransferFailed();
        }
    }
}