import { expect } from "chai";
import { network } from "hardhat";

const { ethers, provider } = await network.create();

describe("DefiStakingVault Test", function() {
    let defiStakingVault: any;
    let stakeToken: any;
    let rewardToken: any;
    let owner: any;
    let user1: any;

    it("Should deploy contracts and fund the vault", async function() {
        const signers = await ethers.getSigners();
        owner = signers[0];
        user1 = signers[1];

        const factory1 = await ethers.getContractFactory("StakeToken");
        stakeToken = await factory1.deploy();
        await stakeToken.waitForDeployment();

        const factory2 = await ethers.getContractFactory("RewardToken");
        rewardToken = await factory2.deploy();
        await rewardToken.waitForDeployment();

        const factory3 = await ethers.getContractFactory("DefiStakingVault");
        defiStakingVault = await factory3.deploy(stakeToken.target, rewardToken.target);
        await defiStakingVault.waitForDeployment();

        await stakeToken.connect(user1).faucet();

        const fundAmount = ethers.parseUnits("50000", 18);
        await rewardToken.connect(owner).transfer(defiStakingVault.target, fundAmount);
    })

    it("Should allow user1 to stake tokens", async function() {
        const amount = ethers.parseUnits("100", 18);

        await stakeToken.connect(user1).approve(defiStakingVault.target, amount);
        await defiStakingVault.connect(user1).stake(amount);

        const userStakeBalance = await defiStakingVault.stakeBalance(user1.address);
        expect(userStakeBalance).to.equal(amount);
    })

    it("Should allow user1 to withdraw staked tokens", async function() {
        const amount = ethers.parseUnits("100", 18);

        const threeDays = 86400 * 3;

        await provider.request({
            method: "evm_increaseTime",
            params: [threeDays]
        });

        await provider.request({
            method: "evm_mine"
        });

        await defiStakingVault.connect(user1).withdraw(amount)

        const userStakeBalance = await defiStakingVault.stakeBalance(user1.address)

        expect(userStakeBalance).to.equal(0);
    })

    it("Should allow user1 to claim rewards correctly", async function() {
        await defiStakingVault.connect(user1).claimReward();

        const expectedReward = ethers.parseUnits("30000", 18);

        const userRewardBalance = await rewardToken.balanceOf(user1.address);

        expect(userRewardBalance).to.equal(expectedReward);
    })
})