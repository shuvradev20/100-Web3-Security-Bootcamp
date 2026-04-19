# Problem 02: Two-Step Ownership Transfer

## Overview
For my second challenge, I tackled a massive vulnerability in legacy smart contracts: single-step ownership transfers. I built a Two-Step Ownership Transfer contract. Instead of instantly changing the owner in one go (where a simple typo could send the ownership to a dead address and permanently lock the protocol), the current owner has to nominate a "Pending Owner". The transfer is only finalized when that specific pending owner actively accepts it from their own wallet. It's a simple fix, but it prevents millions of dollars from getting locked.

## Tech Stack & Concepts Applied
* Solidity ^0.8.32
* Hardhat v3 & Ethers v6
* TypeScript & Chai
* Two-Step Verification Pattern
* Custom Errors for Gas Optimization

## Key Learnings & Challenges Conquered
1. The core logic is actually quite simple but powerful: splitting the transfer into two distinct actions (`nominateNewOwner` and `acceptOwnership`). This completely removes the risk of accidental ownership burns.
2. I added a strict `address(0)` check. It's surprising how easy it is to accidentally hand over a protocol to a null address without this basic validation.
3. I replaced standard `require` strings with Custom Errors like `Unauthorized()` and `InvalidAddress()`. It makes the code look much cleaner and saves a noticeable amount of deployment gas.
4. I kept the test file structure flat and straightforward. I realized that avoiding complex nested fixtures helps prevent those tricky TypeScript compilation errors when testing with modern Ethers v6.

## How to Run the Tests
```bash
# Compile the smart contract
npx hardhat compile

# Run the test suite
npx hardhat test