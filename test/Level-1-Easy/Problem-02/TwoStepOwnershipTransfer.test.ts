import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("OwnershipTransfer", function () {
  
  it("Should set the deployer as the initial owner", async function () {
    const contract = (await ethers.deployContract("OwnershipTransfer")) as any;
    
    const signers = await ethers.getSigners();
    const owner = signers[0]; 

    expect(await contract.owner()).to.equal(owner.address);
    expect(await contract.pendingOwner()).to.equal(ethers.ZeroAddress);
  });

  it("Should allow owner to nominate a new owner", async function () {
    const contract = (await ethers.deployContract("OwnershipTransfer")) as any;
    
    const signers = await ethers.getSigners();
    const newOwner = signers[1];

    await expect(contract.nominateNewOwner(newOwner.address))
      .to.emit(contract, "NominateNewOwner")
      .withArgs(newOwner.address);

    expect(await contract.pendingOwner()).to.equal(newOwner.address);
  });

  it("Should revert if a hacker tries to nominate", async function () {
    const contract = (await ethers.deployContract("OwnershipTransfer")) as any;
    
    const signers = await ethers.getSigners();
    const hacker = signers[2]; 

    await expect(contract.connect(hacker).nominateNewOwner(hacker.address))
      .to.be.revertedWithCustomError(contract, "Unauthorized");
  });

  it("Should revert if owner nominates the zero address", async function () {
    const contract = (await ethers.deployContract("OwnershipTransfer")) as any;

    await expect(contract.nominateNewOwner(ethers.ZeroAddress))
      .to.be.revertedWithCustomError(contract, "InvalidAddress");
  });

  it("Should allow pending owner to accept and update state", async function () {
    const contract = (await ethers.deployContract("OwnershipTransfer")) as any;
    
    const signers = await ethers.getSigners();
    const newOwner = signers[1];

    await contract.nominateNewOwner(newOwner.address);

    await expect(contract.connect(newOwner).acceptOwnership())
      .to.emit(contract, "AcceptOwnership")
      .withArgs(newOwner.address);

    expect(await contract.owner()).to.equal(newOwner.address);
    expect(await contract.pendingOwner()).to.equal(ethers.ZeroAddress);
  });

  it("Should revert if hacker tries to accept ownership", async function () {
    const contract = (await ethers.deployContract("OwnershipTransfer")) as any;
    
    const signers = await ethers.getSigners();
    const newOwner = signers[1];
    const hacker = signers[2];

    await contract.nominateNewOwner(newOwner.address);

    await expect(contract.connect(hacker).acceptOwnership())
      .to.be.revertedWithCustomError(contract, "NotPendingOwner");
  });

  it("Should allow owner to cancel the transfer", async function () {
    const contract = (await ethers.deployContract("OwnershipTransfer")) as any;
    
    const signers = await ethers.getSigners();
    const newOwner = signers[1];

    await contract.nominateNewOwner(newOwner.address);

    await expect(contract.cancelTransfer())
      .to.emit(contract, "TransferCancelled")
      .withArgs(newOwner.address);

    expect(await contract.pendingOwner()).to.equal(ethers.ZeroAddress);
  });
  
});