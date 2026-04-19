// SPDX-License-Identifier: MIT
pragma solidity ^0.8.32;

contract OwnershipTransfer {
    address public owner;
    address public pendingOwner;

    error Unauthorized();
    error InvalidAddress();
    error NotPendingOwner();

    event NominateNewOwner(address indexed nominateOwner);
    event AcceptOwnership(address indexed owner);
    event TransferCancelled(address indexed nominateOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if(msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    function nominateNewOwner(address _nominateOwner) external onlyOwner {
        if(_nominateOwner == address(0)) {
            revert InvalidAddress();
        }

        pendingOwner = _nominateOwner;
        emit NominateNewOwner(_nominateOwner);
    }

    function acceptOwnership() external {
        if(msg.sender != pendingOwner) {
            revert NotPendingOwner();
        }

        owner = pendingOwner;
        pendingOwner = address(0);
        emit AcceptOwnership(owner);
    }

    function cancelTransfer() external onlyOwner {
        emit TransferCancelled(pendingOwner);
        pendingOwner = address(0);
        
    }
}