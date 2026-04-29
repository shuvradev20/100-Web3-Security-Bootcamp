// SPDX-License-Identifier: MIT
pragma solidity ^0.8.32;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor() ERC20("Reward Token", "RTOKEN") {
        _mint(msg.sender, 50000 * 10 ** decimals());
    }
}