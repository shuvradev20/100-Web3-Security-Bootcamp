import {expect} from "chai";
import {network} from "hardhat"

const {ethers} = await network.create()
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

describe("MerkleWhitelistNFT Flat Test", function() {
    let merkleContract: any;
    let owner: any;
    let user1: any;
    let user2: any;
    let hacker: any;
    let tree!: StandardMerkleTree<any[]>;
    let root: string;

    it("Should setup Merkle Tree and deploy contract", async function() {
        const signers = await ethers.getSigners();

        owner = signers[0];
        user1 = signers[1];
        user2 = signers[2];
        hacker = signers[3];

        const values = [
            [user1.address, 1],
            [user2.address, 1]
        ]

        tree = StandardMerkleTree.of(values, ["address", "uint256"]);

        root = tree.root;

        const Factory = await ethers.getContractFactory("MerkleWhitelistNFT");

        merkleContract = await Factory.deploy("WhitelistNFT", "WNFT", root);
        await merkleContract.waitForDeployment();

        expect(merkleContract.target).to.not.equal(ethers.ZeroAddress);
        expect(await merkleContract.merkleRoot()).to.equal(root);
    })

    it("Should allow a whitelisted user (user1) to mint", async function() {
        let proof: string[] = [];
        for(const[i, v] of tree.entries()) {
            if(v[0] === user1.address) {
                proof = tree.getProof(i);
            }
        }

        await (merkleContract.connect(user1).whitelistMint(proof))

        expect(await merkleContract.hashMinted(user1.address)).to.be.true;
    })

    it("Should revert with AlreadyMinted if user1 tries to mint again", async function () {
        let proof: string[] = [];
        for (const [i, v] of tree.entries()) {
        if (v[0] === user1.address) {
            proof = tree.getProof(i);
        }
        }

        await expect(
        merkleContract.connect(user1).whitelistMint(proof)
        ).to.be.revertedWithCustomError(merkleContract, "AlreadyMinted");
    });



    it("Should revert with 'Invalid proof' if hacker tries to mint", async function() {
        let proof: string[] = [];
        for (const [i, v] of tree.entries()){
            if(v[0] === user1.address) {
                proof = tree.getProof(i);
            }
        }

        await expect(merkleContract.connect(hacker).whitelistMint(proof))
        .to.be.revertedWith("Invalid proof");
    });

    it("Should allow owner to update the Merkle Root", async function() {
        const newRoot = ethers.encodeBytes32String("ThisIsANewRoot");

        await merkleContract.connect(owner).updateMerkleRoot(newRoot);

        expect(await merkleContract.merkleRoot()).to.equal(newRoot)
    })

    it("Should revert if hacker tries to update the Merkle Root", async function () {
        const newRoot = ethers.encodeBytes32String("HackerRoot");

        await expect(
        merkleContract.connect(hacker).updateMerkleRoot(newRoot)
        ).to.be.revertedWithCustomError(merkleContract, "Unauthorized");
    });
})