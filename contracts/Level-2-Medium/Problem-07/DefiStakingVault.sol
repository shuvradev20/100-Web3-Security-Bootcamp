// SPDX-License-Identifier: MIT
pragma solidity ^0.8.32;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DefiStakingVault {

    error ZeroAmount();
    error InvalidAmount();

    IERC20 public stakeToken;
    IERC20 public rewardToken;

    uint256 public rewardRate = 100;

    mapping(address => uint256) public userLastUpdateTime;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public stakeBalance;

    constructor(address _stakeToken, address _rewardToken) {
        stakeToken = IERC20(_stakeToken);
        rewardToken = IERC20(_rewardToken);
    }

    modifier updateReward(address account) {
       if(stakeBalance[account] > 0) {
            uint256 timePassedInSeconds = block.timestamp - userLastUpdateTime[account];
            uint256 daysPassed = timePassedInSeconds / 1 days;

            if(daysPassed > 0) {
                uint256 earnedReward = stakeBalance[account] * daysPassed * rewardRate;
                rewards[account] += earnedReward;

                userLastUpdateTime[account] += (daysPassed * 1 days);
            } 
        } else {
            userLastUpdateTime[account] = block.timestamp;
       }
       _;
    }

    function stake(uint256 amount) external updateReward(msg.sender) {
        if( amount == 0 ) revert ZeroAmount();
        stakeBalance[msg.sender] += amount;
        stakeToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external updateReward(msg.sender) {
        if(amount == 0 || stakeBalance[msg.sender] < amount) revert InvalidAmount(); 

        stakeBalance[msg.sender] -= amount;
        stakeToken.transfer(msg.sender, amount);
    }

    function claimReward() external updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if(reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.transfer(msg.sender, reward);
        }
    }
}