const { ethers } = require("ethers");
const chains = require("./chains");
const util = require("./util");

const provider = chains.mainnet["ethereum"].rotateRpcProvider();

async function getTxCount(address) {
  try {
    const count = await provider.getTransactionCount(address);
    return count;
  } catch (error) {
    console.error(`Lỗi với ví ${address}: ${error.message}`);
    return null;
  }
}

async function sendSelfTx(privateKey, address) {
  const wallet = new ethers.Wallet(privateKey, provider);

  // 1. Lấy số dư ví (đơn vị wei)
  const balance = await provider.getBalance(address);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

  // 2. Lấy gas price thấp nhất hiện tại
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice;

  console.log(`Gas price: ${ethers.formatUnits(gasPrice, 'gwei')} gwei`);


  // 3. Ước tính phí gas
  const estimatedGasLimit = 21000n;
  const estimatedFee = gasPrice * estimatedGasLimit;

  // 4. Tính 50% số dư trừ phí
  const halfBalance = (balance - estimatedFee) / 2n;

  if (halfBalance <= 0) {
    console.error('Số dư không đủ để gửi sau khi trừ phí');
    return;
  }

  // 5. Tạo và gửi giao dịch
  const tx = await wallet.sendTransaction({
    to: address,
    value: halfBalance,
    gasLimit: estimatedGasLimit,
    gasPrice: gasPrice
  });

  console.log('Transaction sent:', tx.hash);
  const receipt = await tx.wait();
  console.log('Transaction confirmed:', receipt.transactionHash);
}

async function main() {
  const accounts = util.readExcelFile("data.xlsx");
  for (const { address, name, privateKey } of accounts) {
    if (address && privateKey) {
      const count = await getTxCount(address);
      console.log(`Username: ${name} đã thực hiện ${count} giao dịch.`);
      if (count < 3) {
        await sendSelfTx(privateKey, address);
      }
    }
  }
}

main();