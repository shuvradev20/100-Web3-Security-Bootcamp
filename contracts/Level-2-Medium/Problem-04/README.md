# Problem 4: Decentralized Crowdfunding Vault 💰

## 📝 Real-world Scenario
A Web3 crowdfunding protocol acting similar to Kickstarter for ICOs. It allows project creators to raise ETH with a specific funding goal and a strict time limit. If the campaign succeeds, the creator can claim the funds; if it fails, investors can safely refund their pledges.

## ⚙️ Business Logic
- The contract is initialized with a specific funding goal and a deadline (set to 7 days from deployment).
- Users can deposit ETH to fund the project only while the campaign is active.
- The project owner can exclusively claim the total accumulated ETH only if the deadline has passed and the funding goal is met.
- If the deadline passes and the funding goal is not met, investors are allowed to individually refund their pledged ETH.
- Funds are safely tracked per user using an internal mapping.

## 🛡️ Security & 2026 Standards Implemented
- **Strict CEI Pattern (Reentrancy Protection):** Perfectly executed the Checks-Effects-Interactions pattern in the `refund()` function by zeroing out the user's balance (`funds[msg.sender] = 0;`) *before* executing the external ETH transfer, mitigating severe reentrancy risks.
- **Pull-over-Push Pattern:** Investors must individually call `refund()` to get their money back. This prevents Denial of Service (DoS) attacks that occur when trying to loop through massive investor arrays to push funds automatically.
- **Custom Errors:** Implemented comprehensive gas-optimized custom errors (`Expired()`, `StillActive()`, `GoalNotMet()`, `GoalReached()`, `NoFundsToRefund()`) for every failure case.
- **Safe ETH Transfers:** Utilized low-level `.call{value: ...}("")` paired with strict success boolean checks, completely avoiding the deprecated and unsafe `transfer()` or `send()` methods.
- **Event Emissions:** State-changing actions correctly emit indexed events (`Claim`, `Refund`) for transparent off-chain tracking and indexer integration.

## 🧪 How to Test
To run the test cases for this specific contract:
```bash
npx hardhat test test/Level-2-Medium/Problem-04/CrowdfundingVault.test.ts