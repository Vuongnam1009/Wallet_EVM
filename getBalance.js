const fs = require('fs');
const util = require('./util')
const base = require(`./chain/mainnet/base`)
const ethers = require('ethers');


const data = fs.readFileSync("data.json", "utf8");
const accounts = JSON.parse(data);
const provider = base.rotateRpcProvider()

async function getBalance(address) {
    const balance = await provider.getBalance(address);
    return balance
}



 async function main() {
   try {
     for (const profileName of Object.keys(accounts)) {
      const { address } = accounts[profileName];
      const balance = await getBalance(address);
      console.log(`Account ${profileName} ---- Số dư ETH: ${Number(ethers.formatEther(balance)).toFixed(5)}`);

    }

  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main();