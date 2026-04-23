import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("TimeLockVault", function () {
  
  it("Should revert with Unauthorized when non-owner tries to queue", async function () {
    const vault = (await ethers.deployContract("TimeLockVault")) as any;
    
    const signers = await ethers.getSigners();
    const hacker = signers[1]; 
    const amount = ethers.parseEther("1");

    await expect(vault.connect(hacker).queueWithdrawal(amount))
      .to.be.revertedWithCustomError(vault, "Unauthorized");
  });

  it("Should queue a withdrawal and update currentRequest", async function () {
    const vault = (await ethers.deployContract("TimeLockVault")) as any;
    const amount = ethers.parseEther("1");

    await vault.queueWithdrawal(amount);

    const request = await vault.currentRequest();
    
    expect(request.amount).to.equal(amount);
    expect(request.unlockTime).to.be.greaterThan(0n);
  });

  it("Should revert if owner tries to execute before 3 days", async function () {
    const vault = (await ethers.deployContract("TimeLockVault")) as any;
    const signers = await ethers.getSigners();
    const owner = signers[0];
    const amount = ethers.parseEther("1");

    await owner.sendTransaction({ to: vault.target, value: amount });
    await vault.queueWithdrawal(amount);

    await expect(vault.executeWithdrawal())
      .to.be.revertedWithCustomError(vault, "TimeLockActive");
  });

  it("Should execute withdrawal successfully after 3 days", async function () {
    const vault = (await ethers.deployContract("TimeLockVault")) as any;
    const signers = await ethers.getSigners();
    const owner = signers[0];
    const amount = ethers.parseEther("1");

    await owner.sendTransaction({ to: vault.target, value: amount });
    await vault.queueWithdrawal(amount);

    const timeToIncrease = 3 * 24 * 60 * 60 + 1; 
    await (owner.provider as any).send("evm_increaseTime", [timeToIncrease]);
    await (owner.provider as any).send("evm_mine", []); 

    // Withdrawal execute korlam
    await vault.executeWithdrawal();

    // Chai matcher baad! Manual balance check korchi jeta konodin fail kore na
    // Contract theke 1 ETH ber hoye vault balance 0 hoyeche kina dekhchi
    const vaultBalance = await ethers.provider.getBalance(vault.target);
    expect(vaultBalance).to.equal(0n);

    // CEI pattern check
    const request = await vault.currentRequest();
    expect(request.amount).to.equal(0n);
    expect(request.unlockTime).to.equal(0n);
  });
  
});