# Problem 1: Protocol Fee Timelock Vault ⏱️

## 📝 Real-world Scenario
A Decentralized Exchange (DEX) needs a Fee Vault to collect protocol trading fees. To protect the protocol from immediate fund drainage in case the owner's private key is compromised, a time-delay security layer (Timelock) is implemented.

## ⚙️ Business Logic & 2026 Standards Implemented
- Anyone can deposit ETH into the vault.
- Only the contract owner can withdraw funds. 
- Direct withdrawals are strictly prohibited. The owner must `queue` a withdrawal request first, specifying the amount.
- After a mandatory waiting period of 3 days, the owner can `execute` the withdrawal to transfer the funds to their wallet.
- Only one pending withdrawal request is allowed at a time.

## 🛡️ Security
- **Custom Errors:** Avoided gas-heavy `require` strings with revert reasons. Implemented `Unauthorized()`, `TimeLockActive()`, and `TransferFailed()`.
- **Safe ETH Transfers:** Banned the use of `transfer()` and `send()`. Used low-level `call` with success boolean verification to prevent silent failures and handle dynamic gas limits.
- **CEI Pattern:** Applied the Checks-Effects-Interactions pattern perfectly. The contract state (amount and unlockTime) is reset to 0 *before* making the external call, effectively preventing any reentrancy attacks.
- **Strict Storage Packing:** Optimized storage by packing `uint96 amount` and `uint64 unlockTime` into a single 256-bit storage slot, significantly reducing deployment and interaction gas costs.

## 🧪 How to Test
To run the test cases for this specific contract:
```bash
npx hardhat test test/Level-1-Easy/Problem-01/TimelockVault.test.ts