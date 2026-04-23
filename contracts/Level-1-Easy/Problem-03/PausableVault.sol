// SPDX-License-Identifier: MIT
pragma solidity ^0.8.32;

contract PausableVault {
    bool public isPaused;
    address public owner;

    error AlreadyPaused();
    error AlreadyUnpaused();
    error InsufficientBalance();
    error UnauthorizedOwner();
    error WithdrawFail();

    mapping(address => uint256) public balances;

    event Paused(bool isPaused);
    event UnPaused(bool isPaused);
    event Withdrawn(bool success);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if(msg.sender != owner) {
            revert UnauthorizedOwner();
        }
        _;
    }

    modifier Unpaused() {
        if(isPaused == true) {
            revert AlreadyPaused();
        }
        _;
    }

    function pausedVault() external onlyOwner {
        if(isPaused == true) {
            revert AlreadyPaused();
        }

        isPaused = true;

        emit Paused(isPaused);
    }

    function UnpausedVault() external onlyOwner {
        if(isPaused == false) {
            revert AlreadyUnpaused();
        }

        isPaused = false;

        emit UnPaused(isPaused);
    }

    function deposit() public payable Unpaused {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _balance) public Unpaused {
        if(balances[msg.sender] < _balance) {
            revert InsufficientBalance();
        }

        balances[msg.sender] -= _balance;

        (bool success, ) = msg.sender.call{value: _balance}("");
        if(success != true) {
            revert WithdrawFail();
        }

        emit Withdrawn(success);
    }

}