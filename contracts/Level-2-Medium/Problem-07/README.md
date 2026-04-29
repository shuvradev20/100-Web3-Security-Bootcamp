# Problem 7: DeFi Staking Vault (Time-Based Rewards) 🌾

## 📝 Real-world Scenario
In the Decentralized Finance (DeFi) ecosystem, liquidity is king. Protocols incentivize users to lock their tokens in a "Staking Vault" to provide stability. In return, the protocol rewards them with native tokens over time. This contract implements a time-based reward mechanism where users earn incentives based on the amount they stake and the duration they keep it locked.

## ⚙️ Business Logic
- **Staking:** Users can deposit `STOKEN` into the vault. Their balance is tracked, and the staking clock starts.
- **Reward Accrual:** For every token staked, users earn `RTOKEN` at a predefined `rewardRate`.
- **Dynamic Updates:** The contract uses a specialized modifier to calculate and "snap-shot" earned rewards every time a user interacts (stake, withdraw, or claim).
- **Withdrawal:** Users can unstake their tokens at any time, which automatically updates and saves their pending rewards.
- **Claiming:** Users can harvest their accumulated rewards separately without needing to unstake their principal amount.

## 🛡️ Security & 2026 Standards Implemented
- **Modifier-based Accounting:** Implemented the `updateReward` modifier to ensure no "stale" data exists. This prevents users from claiming more than they earned by updating the reward state *before* any balance changes occur.
- **Precision Management:** Mathematical operations are ordered to prioritize multiplication before division, minimizing "Precision Loss" which is common in Solidity's integer-only environment.
- **CEI Pattern (Checks-Effects-Interactions):** The `withdraw` function strictly updates the user's `stakeBalance` state *before* performing the token transfer, neutralizing potential reentrancy threats.
- **Custom Errors:** Optimized for gas by using `ZeroAmount()` and `InvalidAmount()` custom errors instead of traditional, expensive `require` strings.
- **Separation of Concerns:** Uses separate interfaces for `stakeToken` and `rewardToken`, ensuring a clean modular structure for a dual-token DeFi economy.

## 🧪 How to Test
To run the test cases for this specific contract:
```bash
npx hardhat test test/Level-2-Medium/Problem-07/DefiStakingVault.test.ts