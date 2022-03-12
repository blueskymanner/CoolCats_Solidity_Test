# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```



1. Go to root directory and input following command on CLI.
npm install


2. For having a test, please input following command on CLI.
npx hardhat test


3. For deploying smart contracts.
- Open .env file and input your wallet accout private key with rinkeby testnet ETH balance.

- Please input following command on CLI
npx hardhat run --network rinkeby scripts/deploy_contracts.js
