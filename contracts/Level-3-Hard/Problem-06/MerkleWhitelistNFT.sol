// SPDX-License-Identifier: MIT
pragma solidity ^0.8.32;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleWhitelistNFT is ERC721 {

    error Unauthorized();
    error AlreadyMinted();

    bytes32 public merkleRoot;
    mapping(address => bool) public hashMinted;
    uint256 private _nextTokenId;
    address public owner;

    modifier onlyOwner() {
        if(msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor(
        string memory name, 
        string memory symbol,
        bytes32 _initialRoot
        ) ERC721(name, symbol) {
            merkleRoot = _initialRoot;
            owner = msg.sender;
    }

    function whitelistMint(bytes32[] calldata proof) external {
        if(hashMinted[msg.sender]) revert AlreadyMinted();

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, uint256(1)))));

        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");

        hashMinted[msg.sender] = true;

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function updateMerkleRoot(bytes32 _newRoot) external onlyOwner {
        merkleRoot = _newRoot;
    }
}