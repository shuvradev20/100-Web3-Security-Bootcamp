import { expect } from "chai";
import { network } from "hardhat";

const {ethers, networkHelpers } = await network.create();

describe("CrowdFundingVault Contract", function() {
    async function deployVaultFixture() {
        const [owner, user1, user2] = await ethers.getSigners();
        const fundingGoal = ethers.parseEther("10");

        const vault = await ethers.deployContract("CrowdfundingVault", [fundingGoal]);
        await vault.waitForDeployment();

        const currentTime = await networkHelpers.time.latest();
        const expectedDeadline = currentTime + (7 * 24 * 60 * 60);

        return { owner, user1, user2, vault, fundingGoal, expectedDeadline}
    }

    describe("Deployment", function() {
        it("Should st the right owner, funding goal and deadline", async function() {
            const {owner, vault, fundingGoal, expectedDeadline} = await networkHelpers.loadFixture(deployVaultFixture);

            expect(await vault.owner()).to.equal(owner.address);
            expect(await vault.fundingGoal()).to.equal(fundingGoal)
            expect(await vault.deadline()).to.equal(expectedDeadline)
        })
    })

    describe("Deposit and Claim", function() {
        it("Should allow owner to claim funds if goal is met and deadline has passed", async function() {
            const {owner , user1, fundingGoal, vault} = await networkHelpers.loadFixture(deployVaultFixture);

            await vault.connect(user1).deposit({value: fundingGoal});

            const sevenDaysAndaBit = (7 * 24 * 60 * 60) + 1

            await networkHelpers.time.increase(sevenDaysAndaBit)

            await expect(vault.connect(owner).claim())
            .to.emit(vault, "Claim")
            .withArgs(fundingGoal);
        })
    })

    describe("Deposit and Refund", function() {
        it("Should allow a user to get a refund if goal is not met and deadline has passed", async function() {
            const {owner, user1, vault} = await networkHelpers.loadFixture(deployVaultFixture);

            const amount = ethers.parseEther("5");
            await vault.connect(user1).deposit({value: amount});

            const sevenDaysAndaBit = (7 * 24 * 60 * 60) + 1
            await networkHelpers.time.increase(sevenDaysAndaBit);

            await expect(vault.connect(user1).refund())
            .to.emit(vault, "Refund")
            .withArgs(user1.address, amount);
        })
    })

    describe("Error Handling", function() {
        it("Should revert deposit if the deadline has passed", async function() {
            const { user1, vault } = await networkHelpers.loadFixture(deployVaultFixture);

            const sevenDaysAndaBit = (7 * 24 * 60 * 60) + 1

            await networkHelpers.time.increase(sevenDaysAndaBit);

            await expect(vault.connect(user1).deposit())
            .to.be.revertedWithCustomError(vault, "Expired");
        })

        it("Should revert with Unauthorized if a non-owner tries to claim", async function() {
            const {user1, user2, fundingGoal, vault} = await networkHelpers.loadFixture(deployVaultFixture)

            await vault.connect(user1).deposit({value: fundingGoal});

            const sevenDaysAndaBit = (7 * 24 * 60 * 60) + 1
            await networkHelpers.time.increase(sevenDaysAndaBit);

            await expect(vault.connect(user2).claim())
            .to.be.revertedWithCustomError(vault, "Unauthorized");
        })

        it("Should revert with StillActive if owner tries to claim before deadline", async function() {
            const {user1, owner, vault} = await networkHelpers.loadFixture(deployVaultFixture);

            const amount = ethers.parseEther("5");

            await vault.connect(user1).deposit({value: amount});

            await expect(vault.connect(owner).claim())
            .to.be.revertedWithCustomError(vault, "StillActive")
        })

        it("Should revert with GoalNotMet if owner claims but goal is not reached", async function() {
            const {owner, vault} = await networkHelpers.loadFixture(deployVaultFixture);
            const sevenDaysAndaBit = (7 * 24 * 60 * 60) + 1
            await networkHelpers.time.increase(sevenDaysAndaBit);

            await expect(vault.connect(owner).claim())
            .to.be.revertedWithCustomError(vault, "GoalNotMet")
        })

        it("Should revert with GoalReached if user tries to refund but goal was met", async function() {
            const {user1, vault, fundingGoal} = await networkHelpers.loadFixture(deployVaultFixture)

            await vault.connect(user1).deposit({value: fundingGoal});
            
            const sevenDaysAndaBit = (7 * 24 * 60 * 60) + 1
            await networkHelpers.time.increase(sevenDaysAndaBit);

            await expect(vault.connect(user1).refund())
            .to.be.revertedWithCustomError(vault, "GoalReached")
        })

        it("Should revert with NoFundsToRefund if a user with 0 balance tries to refund", async function() {
            const {user1, vault} = await networkHelpers.loadFixture(deployVaultFixture);

            const SEVEN_DAYS_AND_A_BIT = (7 * 24 * 60 * 60) + 1;
            await networkHelpers.time.increase(SEVEN_DAYS_AND_A_BIT);

            await expect(vault.connect(user1).refund())
            .to.be.revertedWithCustomError(vault, "NoFundsToRefund")
        })
    })
})