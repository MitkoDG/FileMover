const fs = require('fs');
const path = require('path');
const printer = require('pdf-to-printer'); // Импортираме модула за принтиране

// Функция за преместване на файл с добавяне на дата
function moveFileWithDate(source, destinationFolder) {
    const date = new Date().toISOString().split('T')[0]; // Получаване на текущата дата
    const fileName = path.basename(source);
    const fileBaseName = path.basename(fileName, path.extname(fileName)); // Премахване на разширението
    const fileExtension = path.extname(fileName); // Вземане на разширението
    const newFileName = `${fileBaseName} ${date}${fileExtension}`; // Дата след името на файла
    const destination = path.join(destinationFolder, newFileName);

    // Принтиране на PDF файла
    printer.print(source).then(() => {
		// printer.print(source, { printer: 'името-на-принтера' }); // ако искам да имам опция за избиране на конкретен принтер
        console.log(`Printed file: ${source}`);
        // След като принтирането е завършено, премести файла
        fs.rename(source, destination, (err) => {
            if (err) throw err;
            console.log(`File is moved to: ${destination}`);
        });
    }).catch((err) => {
        console.error(`Error in printing: ${err}`);
    });
}

pdfFiles.forEach(file => {
    const sourcePath = path.join(sourceFolder, file);
    try {
        printer.print(sourcePath);
        console.log(`Файлът ${file} е успешно отпечатан.`);
        // ... останалата част от кода за преместване и логване
    } catch (error) {
        console.error(`Грешка при печат на файла ${file}:`, error);
        // Тук можете да добавите допълнителна логика за обработка на грешката, например да изпратите известие по имейл или да запишете грешката в лог файл.
    }
});

// Път до папката с файлове
const sourceFolder = 'C:/Users/PC User/Desktop/glasses za puskane/print';
const destinationFolder = 'C:/Users/PC User/Desktop/glasses za puskane/dadeni';

if (!fs.existsSync(sourceFolder)) {
    console.error(`Folder ${sourceFolder} doesnt exist.`);
    process.exit(1); // Прекратяване на скрипта
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
