const { ethers } = require("hardhat");
async function main() {
  const [signer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(signer.address);
  const network = await ethers.provider.getNetwork();
  console.log("Address:", signer.address);
  console.log("Balance:", ethers.formatEther(balance), "0G");
  console.log("Chain ID:", network.chainId.toString());
}
main().catch(console.error);
