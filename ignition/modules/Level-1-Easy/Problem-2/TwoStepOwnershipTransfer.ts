import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OwnershipTransferModule = buildModule("OwnershipTransferModule", (m) => {
  
  const ownershipTransfer = m.contract("TwoStepOwnershipTransfer");

  return { ownershipTransfer };
});

export default OwnershipTransferModule;