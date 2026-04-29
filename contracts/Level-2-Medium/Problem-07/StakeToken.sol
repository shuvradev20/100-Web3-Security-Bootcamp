// SPDX-License-Identifier: MIT
pragma solidity ^0.8.32;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakeToken is ERC20 {
    mapping(address => uint256) public lastFaucetTime;

    constructor() ERC20("Stake Token", "STOKEN") {}

    function faucet() external {
        require(block.timestamp >= lastFaucetTime[msg._msgSender] + 1 days, "You can only claim once every 24 hours.");

        lastFaucetTime[msg.sender] = block.timestamp;
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}