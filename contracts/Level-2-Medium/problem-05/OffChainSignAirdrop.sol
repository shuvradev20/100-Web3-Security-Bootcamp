// SPDX-License-Identifier: MIT
pragma solidity ^0.8.32;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AirdropToken {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address public admin;
    IERC20 public token;

    error AlreadyClaimed();
    error InvalidSignature();
    error TransferFailed();
    error ZeroAddress();

    mapping (address => bool) public checkClaim;

    event ClaimedAmount(address indexed user, uint256 amount);

    constructor(address _tokenAddress) {
        if(_tokenAddress == address(0)) revert ZeroAddress();
        admin = msg.sender;
        token = IERC20(_tokenAddress);
    }

    function claim(uint256 _amount, bytes memory _signature) external {
        if(checkClaim[msg.sender]) {
            revert AlreadyClaimed();
        }

        bytes32 messagehash = keccak256(abi.encodePacked(msg.sender, _amount, address(this), block.chainid));

        bytes32 ethSignedMessageHash = messagehash.toEthSignedMessageHash();

        address signer = ethSignedMessageHash.recover(_signature);

        if(signer != admin){
            revert InvalidSignature();
        }

        checkClaim[msg.sender] = true;

        bool success = token.transfer(msg.sender, _amount);

        if(!success) {
            revert TransferFailed();
        }

        emit ClaimedAmount(msg.sender, _amount);
    }
}