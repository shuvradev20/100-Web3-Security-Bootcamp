import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TimelockVaultModule = buildModule("TimelockVaultModule", (m) => {
  const vault = m.contract("TimeLockVault");

  return { vault };
});

export default TimelockVaultModule;