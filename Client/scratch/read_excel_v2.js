const xlsx = require('xlsx');
try {
    const workbook = xlsx.readFile('c:/Users/shiva/vpf_13_apr/RECRUITMENT PROCESS (1).xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log(JSON.stringify(data, null, 2));
} catch (e) {
    console.error(e);
}
