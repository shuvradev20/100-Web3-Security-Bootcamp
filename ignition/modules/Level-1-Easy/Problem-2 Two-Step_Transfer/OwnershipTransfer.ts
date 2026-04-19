import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OwnershiTransferModule = buildModule("OwnershiTransferModule", (m) => {
  const vault = m.contract("OwnershipTransfer");

  return { vault };
});

export default OwnershiTransferModule;