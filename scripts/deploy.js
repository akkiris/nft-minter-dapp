const hre = require("hardhat");

async function main() {
  const nftMinterDapp = await hre.ethers.deployContract("NftMinterDapp");

  await nftMinterDapp.waitForDeployment();

  console.log("NftMinterDapp deployed to:", nftMinterDapp.ownerAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
