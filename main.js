const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const colors = require("colors");
const cliProgress = require("cli-progress");
const chains = require("./chains");
const util = require("./util"); // Thêm dòng này

const provider = chains.mainnet["ethereum"].rotateRpcProvider();

async function getTxCount(address) {
  try {
    const count = await provider.getTransactionCount(address);
    console.log(`Ví ${address} đã thực hiện ${count} giao dịch.`);
    return count;
  } catch (e) {
    console.log(`Lỗi với ví ${address}: ${e.message}`);
    return null;
  }
}

async function main() {
  const accounts = util.readExcelFile("data.xlsx"); // Đọc danh sách ví từ file Excel
  for (const account of accounts) {
    const address = account.address;
    if (address) {
      await getTxCount(address);
    }
  }
}

main();