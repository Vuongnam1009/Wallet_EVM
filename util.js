const XLSX = require("xlsx");



function writeArrayToFile(o, e) {
  try {
    const t = o.join("\n"); r.writeFileSync(e, t), console.log("Array of strings saved to file successfully!");
  } catch (r) { console.error("Error writing to file:", r); }
}
function getData() {
  try {
    const o = r.readFileSync("data.json", "utf8"); return JSON.parse(o);
  } catch (r) { console.error("Error reading or parsing file:", r); }
}
const sleep = r => new Promise((o => setTimeout(o, r)));

const readExcelFile = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const firstSheetName = sheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
};

module.exports = { getData,sleep,readExcelFile};
