const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Address:", signer.address);
  const balance = await ethers.provider.getBalance(signer.address);
  console.log("Balance:", ethers.formatEther(balance), "0G");
  
  if (balance === 0n) {
    console.log("\n⚠️  No balance! Get testnet tokens from:");
    console.log("   https://faucet.0g.ai");
    console.log("   https://cloud.google.com/application/web3/faucet/0g/galileo");
  } else {
    console.log("\n✅ Ready to deploy!");
  }
}

main().catch(console.error);
