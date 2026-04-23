import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers} = await network.create();

describe(" AirdropToken Contract", function() {
    async function deployAirdropFixture() {
        const [admin, user1, user2] = await ethers.getSigners();

        const mockToken = await ethers.deployContract("MockERC20");

        await mockToken.waitForDeployment();

        const AirdropToken = await ethers.deployContract("AirdropToken", [mockToken.target]);
        await AirdropToken.waitForDeployment();

        const fundAmount = ethers.parseUnits("10000", 18);
        await mockToken.transfer(AirdropToken.target, fundAmount);

        return {admin, user1, user2, mockToken, AirdropToken};
    }

    describe("deployment", function() {
        it("Should set the right admin", async function() {
            const {admin, AirdropToken} = await networkHelpers.loadFixture(deployAirdropFixture);
            expect(await AirdropToken.admin()).to.equal(admin.address);
        })
    })

    describe("Claiming Airdrop", function() {
        it("Should allow a user to claim tokens with a valid signature", async function() {
            const { admin, user1, mockToken, AirdropToken} = await networkHelpers.loadFixture(deployAirdropFixture);

            const claimAmount = ethers.parseUnits("100", 18);

            const {chainId} = await ethers.provider.getNetwork();

            const messageHash = ethers.solidityPackedKeccak256(["address", "uint256", "address", "uint256"], [user1.address, claimAmount, AirdropToken.target, chainId]);

            const signature = await admin.signMessage(ethers.getBytes(messageHash));

            await expect(AirdropToken.connect(user1).claim(claimAmount, signature))
            .to.emit(AirdropToken, "ClaimedAmount")
            .withArgs(user1.address, claimAmount);

            const userBalance = await mockToken.balanceOf(user1.address);
            expect(userBalance).to.equal(claimAmount);
        })
    })

    describe("Error handling", function() {
        it("Should revert if signature is invalid", async function() {
            const {admin, user1, user2, AirdropToken} = await networkHelpers.loadFixture(deployAirdropFixture);

            const claimAmount = ethers.parseUnits("100", 18);

            const {chainId} = await ethers.provider.getNetwork();

            const messageHash = ethers.solidityPackedKeccak256(["address", "uint256", "address", "uint256"], [user1.address, claimAmount, AirdropToken.target, chainId]);

            const fakeSignatue = await user2.signMessage(ethers.getBytes(messageHash));

            await expect(AirdropToken.connect(user1).claim(claimAmount, fakeSignatue))
            .to.be.revertedWithCustomError(AirdropToken, "InvalidSignature");
        })
    })
})


