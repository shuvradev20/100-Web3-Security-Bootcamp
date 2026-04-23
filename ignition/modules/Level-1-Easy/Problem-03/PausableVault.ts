import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PausableVaultModule = buildModule("PausableVaultModule", (m) => {
  
  const pausableVault = m.contract("PausableVault");

  return { pausableVault };
});

export default PausableVaultModule;