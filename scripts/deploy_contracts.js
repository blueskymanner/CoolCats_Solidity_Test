const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // const deployerAddress = deployer.address;
  const deployerAddress = await deployer.getAddress();
  console.log('Deploying Milk and ItemFactory with address:', deployerAddress);

  const Milk = await hre.ethers.getContractFactory("Milk");
  const ItemFactory = await hre.ethers.getContractFactory("ItemFactory");

  const milk = await Milk.deploy("MilkToken", "MILK");
  console.log('Milk contract deployed at', milk.address);

  const itemFactory = await ItemFactory.deploy("https://ipfs/R2GOR7LB", milk.address);
  console.log('ItemFactory contract deployed at', itemFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
