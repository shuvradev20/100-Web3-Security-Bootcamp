# Problem 6: NFT Whitelist with Merkle Tree 🌳

## 📝 Real-world Scenario
When a protocol needs to whitelist a massive number of users (e.g., 100,000+) for an exclusive NFT mint, storing every address on-chain is prohibitively expensive due to gas fees. This contract utilizes a Merkle Tree—a cryptographic mathematical structure—to store a single 32-byte "Root" on-chain. This allows the protocol to verify any user's inclusion in the massive whitelist using only a small array of hashes (the "Proof"), keeping gas costs minimal and constant regardless of the whitelist size.

## ⚙️ Business Logic
- The contract stores a single `merkleRoot` which represents the entire whitelisted database.
- Users can mint their exclusive NFT by calling `whitelistMint` and providing a valid Merkle Proof.
- The contract hashes the caller's address (`msg.sender`) to create a "Leaf" and verifies it against the Root using the Proof.
- Only users who were part of the original off-chain Merkle Tree calculation can successfully mint.
- The Admin/Owner has the authority to update the Merkle Root if the whitelist needs to be expanded or changed.

## 🛡️ Security & 2026 Standards Implemented
- **Double-Hashing (Preimage Protection):** Implemented `keccak256(bytes.concat(keccak256(...)))` to prevent "Second Preimage Attacks," ensuring that an attacker cannot craft a fake leaf that looks like a valid address hash.
- **Anti-Double Minting:** Used a `hashMinted` mapping to track users who have already claimed their NFT, preventing whitelisted users from minting more than once.
- **Gas Optimization (Merkle Tree):** By using Merkle Proofs instead of on-chain arrays or mappings for whitelisting, the gas cost for the protocol owner is reduced by over 99%.
- **Secure Root Updates:** Restricted the `updateMerkleRoot` function to the `onlyOwner` modifier, preventing unauthorized parties from hijacking the whitelist.
- **Standard Compliance:** Built on top of the industry-standard `ERC721` (OpenZeppelin) and utilized their audited `MerkleProof` library for cryptographic safety.

## 🧪 How to Test
To run the test cases for this specific contract:
```bash
npx hardhat test test/Level-3-Hard/Problem-06/MerkleWhitelistNFT.test.ts