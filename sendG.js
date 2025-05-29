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

const tokenABI = [
    "function transfer(address to, uint256 amount) public returns (bool)"
];




async function sendToken(privateKey,recipientAddress,num) {
  try {
    const amount = ethers.parseEther(num.toString());
    const wallet = new ethers.Wallet(privateKey, provider);
      const tx = await wallet.sendTransaction({
        to: recipientAddress,
        value: amount
      });
      console.log("Transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);
    } catch (error) {
        console.error('Error:', error);
    }
}

const data_max = {
  F1: 81,
  F2: 16,
  Acc:3
}

 async function main() {
   try {
     for (const profileName of Object.keys(accounts)) {
       const level = profileName.split("_")[0]
       const balance_min = data_max[level]?data_max[level]:2.8
       const { address,privateKey, cha,status} = accounts[profileName];
       if (cha && !status) {
         const balance = await getBalance(address);
         const fatherProfile = accounts[cha]
         if (ethers.formatEther(balance) < balance_min) {
           await sendToken(fatherProfile.privateKey,address,balance_min)
         }
       }

    }

  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main();