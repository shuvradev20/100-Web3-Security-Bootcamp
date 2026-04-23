# Problem 2: Two-Step Ownership Transfer 🔐

## 📝 Real-world Scenario
In the past, single-step ownership transfers led to permanently locked protocols if a wrong address was inputted by mistake. To prevent millions of dollars from getting stuck, this contract implements the modern industry-standard Two-Step Ownership Transfer process, ensuring the new owner actively confirms access before the transfer is finalized.

## ⚙️ Business Logic
- The deployer of the contract is assigned as the initial owner.
- The current owner can safely nominate a new "Pending Owner" address.
- Only the exact nominated Pending Owner can actively call the contract to "Accept" the ownership.
- Upon acceptance, the pending owner becomes the actual owner, and the pending slot is reset to a zero address.
- The current owner can cancel a pending nomination at any time before it is accepted.

## 🛡️ Security & 2026 Standards Implemented
- **Zero-Address Validation:** Strict checks ensure that `address(0)` cannot be nominated, preventing the accidental burning of the owner role.
- **Custom Errors:** Replaced gas-heavy require strings with highly gas-efficient custom errors (`Unauthorized()`, `InvalidAddress()`, `NotPendingOwner()`).
- **Event Emissions:** All critical state changes emit specific events (`NominateNewOwner`, `AcceptOwnership`, `TransferCancelled`) to ensure proper off-chain tracking, transparency, and seamless frontend integration.
- **Two-Step Verification:** Completely mitigates the critical risk of typos or dead addresses during high-stakes role transfers.

## 🧪 How to Test
To run the test cases for this specific contract:
```bash
npx hardhat test test/Level-1-Easy/Problem-02/TwoStepOwnershipTransfer.test.ts