const fs = require('fs');
const path = require('path');
const printer = require('pdf-to-printer');
const xlsx = require('xlsx');

const logFilePath = 'C:/Users/PC User/Desktop/glasses za puskane/FileMover/log.xlsx';

// Функция за преместване на файл с добавяне на дата
function moveFileWithDate(source, destinationFolder) {
    const date = new Date().toISOString().split('T')[0];
    const fileName = path.basename(source);
    const fileBaseName = path.basename(fileName, path.extname(fileName));
    const fileExtension = path.extname(fileName);
    const newFileName = `${fileBaseName} ${date}${fileExtension}`;
    const destination = path.join(destinationFolder, newFileName);

    // Принтиране на файла
    printer.print(source);

    fs.rename(source, destination, (err) => {
        if (err) throw err;
        console.log(`Файлът е преместен в: ${destination}`);

        // Записване на лог файл
        logFileMove(fileName, date);
    });
}

// Функция за логване на файловете в Excel
function logFileMove(fileName, date) {
    let workbook;
    let worksheet;

    // Проверка дали лог файлът съществува
    if (fs.existsSync(logFilePath)) {
        workbook = xlsx.readFile(logFilePath);

        // Проверка дали съществува поне един лист
        if (workbook.SheetNames.length === 0) {
            worksheet = xlsx.utils.aoa_to_sheet([['Date', 'FileName']]); // Ако няма листове, създаваме нов с заглавия
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        } else {
            worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Избираме първия съществуващ лист
        }
    } else {
        workbook = xlsx.utils.book_new(); // Създаваме нова книга
        worksheet = xlsx.utils.aoa_to_sheet([['Date', 'FileName']]); // Добавяме заглавия
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    }

    // Добавяне на нов ред в таблицата
    const newRow = [[date, fileName]];
    xlsx.utils.sheet_add_aoa(worksheet, newRow, { origin: -1 }); // Добавяне на ред под последния

    workbook.Sheets['Sheet1'] = worksheet;
    xlsx.writeFile(workbook, logFilePath);
}

// Път до папката с файлове
const sourceFolder = 'C:/Users/PC User/Desktop/glasses za puskane/print';
const destinationFolder = 'C:/Users/PC User/Desktop/glasses za puskane/dadeni';

if (!fs.existsSync(sourceFolder)) {
    console.error(`Folder ${sourceFolder} doesnt exist.`);
    process.exit(1);
}
if (!fs.existsSync(destinationFolder)) {
    console.error(`Folder ${destinationFolder} doesnt exist.`);
    process.exit(1);
}

// Четене на всички файлове от папката
fs.readdir(sourceFolder, (err, files) => {
    if (err) throw err;

    // Филтриране само на PDF файловете
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

    // Преместване на всеки PDF файл
    pdfFiles.forEach(file => {
        const sourcePath = path.join(sourceFolder, file);
        moveFileWithDate(sourcePath, destinationFolder);
    });
});