import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CrowdfundingVaultModule = buildModule("CrowdfundingVaultModule", (m) => {
  const vault = m.contract("CrowdfundingVault");

  return { vault };
});

export default CrowdfundingVaultModule;