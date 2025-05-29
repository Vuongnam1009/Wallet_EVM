const fs = require('fs/promises');
const util = require('./util')


const accounts = util.readExcelFile('data.xlsx');

let i = {}
async function refreshTokens() {
    try {
      for (const [index,account] of accounts.entries()) {
        const { name, cha, address, privateKey,status } = account
        i[name] = {cha, address, privateKey,status }
      }
      const jsonString = JSON.stringify(i, null, 2)
      fs.writeFile("data.json", jsonString, (err) => {
        if (err) {
          console.error("Lỗi khi ghi vào file:", err);
        } else {
          console.log("Ghi dữ liệu vào file thành công!");
        }
      });

    } catch (error) {
      console.error('Error processing accounts:', error.message);
    }
}

refreshTokens();
