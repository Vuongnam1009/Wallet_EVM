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

 async function main() {
   try {
     for (const profileName of Object.keys(accounts)) {
       const { address, cha,privateKey} = accounts[profileName];
       if (cha) {
         const balance = await getBalance(address);
         const balanceConvert =(Math.floor(ethers.formatEther(balance)  * 10000) / 10000).toFixed(5);
         //  Math.floor(ethers.formatEther(balance) * 100000) / 100000
          if ( balanceConvert < 0.00228) {
          console.log(profileName,(0.00229-balanceConvert).toFixed(5));

           const fatherProfile = accounts[cha]
           await sendToken(fatherProfile.privateKey,address,(0.00229-balanceConvert).toFixed(5))
         }
       }

    }

  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main();