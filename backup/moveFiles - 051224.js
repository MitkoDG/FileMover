const fs = require('fs');
const path = require('path');
const printer = require('pdf-to-printer'); // Временно изключване на модула за принтиране

// Функция за преместване на файл с добавяне на дата
function moveFileWithDate(source, destinationFolder) {
    const date = new Date().toISOString().split('T')[0]; // Получаване на текущата дата
    const fileName = path.basename(source);
    const fileBaseName = path.basename(fileName, path.extname(fileName)); // Премахване на разширението
    const fileExtension = path.extname(fileName); // Вземане на разширението
    const newFileName = `${fileBaseName} ${date}${fileExtension}`; // Дата след името на файла
    const destination = path.join(destinationFolder, newFileName);

    // Принтиране на файла
    printer.print(source).then(() => {
        // След като файлът е принтиран, го премествай
        fs.rename(source, destination, (err) => {
            if (err) throw err;
            console.log(`Файлът е преместен в: ${destination}`);
        });
     }).catch(err => {
        console.error(`Грешка при принтирането на файла: ${err}`);
    });
}

// Път до папката с файлове
const sourceFolder = 'C:/Users/PC User/Desktop/glasses za puskane/print';
const destinationFolder = 'C:/Users/PC User/Desktop/glasses za puskane/dadeni';

if (!fs.existsSync(sourceFolder)) {
    console.error(`Folder ${sourceFolder} doesn't exist.`);
    process.exit(1); // Прекратяване на скрипта
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
