# 🛡️ 100 Web3 Security Bootcamp Challenge

This repository is a personal sprint dedicated to mastering Ethereum smart contract development, security analysis, and auditing. 

My primary goal is to solve 100 real-world smart contract problems, mitigate common vulnerabilities, and consistently write clean, gas-optimized code following industry-standard best practices.

## 🛠️ Tech Stack
- **Smart Contracts:** Solidity
- **Development Framework:** Hardhat (v3.1.8)
- **Testing:** Mocha, Ethers.js v6, TypeScript
- **Deployment:** Hardhat Ignition
- **Environment:** Node.js

## 📂 Repository Structure
The codebase is organized using a simple, flat structure based on difficulty levels:
- `/contracts`: Contains the main `.sol` files and individual `README.md` files for each problem, categorized by level.
- `/test`: Contains the TypeScript test scripts (using flat `it` blocks) for all contracts.
- `/ignition`: Contains the deployment modules.

## 🚀 Quick Setup
To run this project in your local environment, follow these steps:

```bash
# 1. Clone the repository
git clone <your-github-repo-link>

# 2. Install dependencies
npm install

# 3. Compile the smart contracts
npx hardhat compile

# 4. Run all tests
npx hardhat test
