# Problem 3: Emergency Circuit Breaker (Pausable Vault) 🛑

## 📝 Real-world Scenario
In the event of a critical vulnerability or a live hack, millions of dollars can be drained in milliseconds. To mitigate this, the contract implements a "Circuit Breaker" (Pausable) pattern, acting as an emergency switch that freezes all protocol transactions (deposits and withdrawals) to secure user funds until the issue is resolved.

## ⚙️ Business Logic
- Users can securely deposit ETH, which is tracked via an internal accounting system.
- Users can withdraw their deposited ETH at any time during normal operations.
- Only the protocol owner has the authority to trigger the "Pause" or "Unpause" functions.
- When the contract is paused, all core functions (deposit and withdraw) are completely frozen.
- Normal operations resume seamlessly once the protocol is unpaused by the owner.

## 🛡️ Security & 2026 Standards Implemented
- **Pausable Pattern:** Implemented a state-driven boolean (`isPaused`) restricted by an `Unpaused` modifier to halt contract interactions instantly during emergencies.
- **CEI Pattern:** Perfectly applied the Checks-Effects-Interactions pattern in the `withdraw` function by updating the user's balance (`balances[msg.sender] -= _balance;`) *before* executing the external low-level call, effectively preventing reentrancy attacks.
- **Safe Low-Level Calls:** Utilized `msg.sender.call` with a success boolean check and a custom error (`WithdrawFail()`) instead of legacy `transfer()` methods.
- **Custom Errors:** Minimized gas costs by replacing `require` strings with descriptive custom errors (`AlreadyPaused()`, `AlreadyUnpaused()`, `InsufficientBalance()`, `UnauthorizedOwner()`).
- **Event Emissions:** State-changing actions (`Paused`, `UnPaused`, `Withdrawn`) emit events to ensure off-chain monitoring tools and frontends can react in real-time.

## 🧪 How to Test
To run the test cases for this specific contract:
```bash
npx hardhat test test/Level-1-Easy/Problem-03/PausableVault.test.ts