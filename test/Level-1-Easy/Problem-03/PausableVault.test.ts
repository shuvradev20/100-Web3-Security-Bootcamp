import { expect } from "chai";
import { network } from "hardhat";
import { PausedEvent } from "../../../types/ethers-contracts/Level-1-Easy/Problem-03-Pausable-Vault/PausableVault.js";

const {ethers, networkHelpers} =await network.create();

describe("PausableVault Contract", function() {
    async function deployVaultFixture() {
        const [owner, user1, user2] = await ethers.getSigners();

        const pausableVault = await ethers.deployContract("PausableVault");
        await pausableVault.waitForDeployment();

        return {owner, user1, user2, pausableVault};
    }

    describe("Deployment", function() {
        it("Should set the right owner", async function() {
            const {owner, pausableVault} =await networkHelpers.loadFixture(deployVaultFixture);
            expect(await pausableVault.owner()).to.equal(owner.address);
        })
    })

    describe("Deposit and Withdraw", function() {
        it("Should allow a user to deposit ETH", async function() {
            const {user1, pausableVault} = await networkHelpers.loadFixture(deployVaultFixture);

            const depositAmount = ethers.parseEther("1");

            await pausableVault.connect(user1).deposit({value: depositAmount})
            
            const userBalanceInContract = await pausableVault.balances(user1.address);
            expect(userBalanceInContract).to.equal(depositAmount);
        })

        it("Should allow a user to withdraw ETH", async function() {
            const {user1, pausableVault} = await networkHelpers.loadFixture(deployVaultFixture);

            const depositAmount = ethers.parseEther("1");
            
            await pausableVault.connect(user1).deposit({value: depositAmount});

            await expect(pausableVault.connect(user1).withdraw(depositAmount))
            .to.emit(pausableVault, "Withdrawn")
            .withArgs(true);

            const updatedBalance = await pausableVault.balances(user1.address);
            expect(updatedBalance).to.equal(0);
        })
    })

    describe("Error handling", function() {
        it("Should revert if user tries to withdraw more than their balance", async function() {
            const {user1, pausableVault} = await networkHelpers.loadFixture(deployVaultFixture);

            const tryTowithdrawAmount = ethers.parseEther("1");

            await expect(pausableVault.connect(user1).withdraw(tryTowithdrawAmount))
            .to.be.revertedWithCustomError(pausableVault, "InsufficientBalance");
        })

        it("Should revert if a non-owner tries to pause the vauld", async function() {
            const {user1, pausableVault} = await networkHelpers.loadFixture(deployVaultFixture);

            await expect(pausableVault.connect(user1).pausedVault())
            .to.be.revertedWithCustomError(pausableVault, "UnauthorizedOwner");
        })

        it("Should revert if owner tries to pause an already paused vault", async function() {
            const {owner, pausableVault} = await networkHelpers.loadFixture(deployVaultFixture);

            await pausableVault.connect(owner).pausedVault();

            await expect(pausableVault.connect(owner).pausedVault())
            .to.be.revertedWithCustomError(pausableVault, "AlreadyPaused")
        })

        it("Should prevent deposit when the vault is paused",async function() {
            const { owner, user1, pausableVault} = await networkHelpers.loadFixture(deployVaultFixture);

            await pausableVault.connect(owner).pausedVault();

            const depositAmount = ethers.parseEther("1");

            await expect(pausableVault.connect(user1).deposit({value: depositAmount}))
            .to.be.revertedWithCustomError(pausableVault, "AlreadyPaused");
        })

        it("Should prevent withdraw when the vault is paused", async function() {
            const {owner, user1, pausableVault} = await networkHelpers.loadFixture(deployVaultFixture);

            await pausableVault.connect(owner).pausedVault();

            const withdrawAmount = ethers.parseEther("1");

            await expect(pausableVault.connect(user1).withdraw(withdrawAmount))
            .to.be.revertedWithCustomError(pausableVault, "AlreadyPaused");
        })

        it("Should revert if owner tries to unpause an already unpaused vault", async function() {
            const {owner, pausableVault} = await networkHelpers.loadFixture(deployVaultFixture);

            await expect(pausableVault.connect(owner).UnpausedVault())
            .to.be.revertedWithCustomError(pausableVault, "AlreadyUnpaused")
        })
    })
})