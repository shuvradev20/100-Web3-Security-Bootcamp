# Problem 1: Protocol Fee Timelock Vault

## Overview
This is the first project in my journey to solve 100 Web3 Security Challenges. 

I built a secure fee vault for a protocol. The main security feature is a **Timelock Mechanism**: even the owner cannot withdraw funds instantly. They must queue a request and wait for a strict 3-day (72-hour) cooldown period. This acts as a circuit breaker—if the owner's private key is compromised, the protocol has 3 days to react before the funds can be drained.

## Tech Stack & Concepts Applied
* **Smart Contract:** Solidity `^0.8.32`
* **Testing & Deployment:** Hardhat v3, Ethers.js v6, TypeScript, Chai
* **Core Security Patterns:** Checks-Effects-Interactions (CEI) Pattern
* **Gas Optimization:** Storage Slot Packing, Custom Errors

## Key Learnings & Challenges Conquered

Building and testing this vault wasn't just about writing Solidity; it involved configuring a modern testing environment. Here are my major takeaways:

1. **The CEI Pattern is Non-Negotiable:** I learned the critical importance of resetting the `amount` and `unlockTime` to `0` **before** executing the `.call` to transfer ETH. This state-before-transfer logic is the ultimate defense against Reentrancy attacks.
2. **Ethers v6 & BigInt Handling:** Migrating to modern Hardhat setups means dealing with native `BigInt`. I learned to strictly use `0n` instead of `0` in my Chai assertions to avoid TypeScript type-matching crashes.
3. **Storage Slot Packing:** Instead of defaulting to `uint256`, I packed a `uint96` (for the ETH amount) and a `uint64` (for the timestamp) into a single 256-bit storage slot within my struct, significantly reducing gas costs.
4. **Mastering Hardhat Time Travel:** Testing a 3-day lock natively is tricky. I faced challenges with TypeScript compilation errors and undefined providers in modern ESM setups. I successfully bypassed this by pushing direct JSON-RPC commands (`evm_increaseTime` and `evm_mine`) via the `owner.provider`, allowing me to securely manipulate the blockchain time without external package dependencies.

## How to Run the Tests

To compile the contract and run the test suite:

```bash
# Compile the smart contract
npx hardhat compile

# Run the test suite
npx hardhat test