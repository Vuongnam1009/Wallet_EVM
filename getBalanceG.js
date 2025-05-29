const fs = require('fs');
const util = require('./util')
const gravity = require(`./chain/mainnet/gravity`)
const ethers = require('ethers');


const data = fs.readFileSync("data.json", "utf8");
const accounts = JSON.parse(data);
const provider = gravity.rotateRpcProvider()

async function getBalance(address) {
    const balance = await provider.getBalance(address);
    return balance
}

let t = 0

 async function main() {
   try {
     for (const profileName of Object.keys(accounts)) {
       const { address, status } = accounts[profileName];
       if (!status) {
         const balance = await getBalance(address);
         t+=Number(ethers.formatEther(balance))
        console.log(`Account ${profileName} ---- Số dư ETH: ${ethers.formatEther(balance)}`);

       }

     }
     console.log(t);


  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main();