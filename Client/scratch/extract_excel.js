const xlsx = require('xlsx');
const fs = require('fs');
try {
    const workbook = xlsx.readFile('c:/Users/shiva/vpf_13_apr/RECRUITMENT PROCESS (1).xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    fs.writeFileSync('c:/Users/shiva/vpf_13_apr/VP_FINANCE_FINAL/Client/scratch/excel_data.json', JSON.stringify(data, null, 2));
    console.log('Excel data written to excel_data.json');
} catch (e) {
    console.error(e);
}
