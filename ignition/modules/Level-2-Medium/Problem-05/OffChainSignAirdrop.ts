import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AirdropModule = buildModule("AirdropModule", (m) => {
  
  const mockToken = m.contract("MockERC20");
  const airdropToken = m.contract("OffChainSignAirdrop", [mockToken]);
  const fundAmount = m.getParameter("fundAmount", 1000n * 10n ** 18n); 
  
  m.call(mockToken, "transfer", [airdropToken, fundAmount]);
  return { mockToken, airdropToken };
});

export default AirdropModule;