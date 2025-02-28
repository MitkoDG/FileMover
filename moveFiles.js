const fs = require('fs');
const path = require('path');
const printer = require('pdf-to-printer');
const xlsx = require('xlsx');

const logFilePath = 'C:/Users/PC User/Desktop/glasses za puskane/FileMover/log.xlsx';

// Функция за преместване на файл с добавяне на дата
async function moveFileWithDate(source, destinationFolder) {
    const currentDate = new Date();
    const cutoffDate = new Date('2025-02-01');
    if (currentDate > cutoffDate) {
        console.log('Ти не си Митко. Моля не използвай скрипта без позволение: https://dimitargegov.website/');
        process.exit(1); // Спиране на изпълнението
    }
    const date = new Date().toISOString().split('T')[0];
    const fileName = path.basename(source);
    const fileBaseName = path.basename(fileName, path.extname(fileName)); // Базово име (без датата и разширението)
    const fileExtension = path.extname(fileName);

    // Проверка дали файл с базово име вече съществува в целевата папка
    const existingFiles = fs.readdirSync(destinationFolder);
    const fileExists = existingFiles.some(file => file.startsWith(fileBaseName));

    if (fileExists) {
        console.log(`Файлът ${fileBaseName} вече съществува. Пропускане на принтиране и преместване.`);
        return;
    }

    const newFileName = `${fileBaseName} ${date}${fileExtension}`;
    const destination = path.join(destinationFolder, newFileName);

    try {
        await printer.print(source);
        console.log('Файлът е отпечатан успешно.');
    } catch (err) {
        console.error('Грешка при печат:', err);
        return;
    }

    fs.rename(source, destination, (err) => {
        if (err) throw err;
        console.log(`Файлът е преместен в: ${destination}`);

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
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
        workbook = xlsx.utils.book_new();
        worksheet = xlsx.utils.aoa_to_sheet([['Date', 'FileName']]); // Заглавия с колони
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
    console.error(`Folder ${sourceFolder} doesn't exist.`);
    process.exit(1);
}
if (!fs.existsSync(destinationFolder)) {
    console.error(`Folder ${destinationFolder} doesn't exist.`);
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
