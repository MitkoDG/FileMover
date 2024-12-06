const fs = require('fs');
const path = require('path');

// Функция за преместване на файл с добавяне на дата след името
function moveFileWithDate(source, destinationFolder) {
    const date = new Date().toISOString().split('T')[0]; // Получаване на текущата дата
    const fileName = path.basename(source);
    const fileBaseName = path.basename(fileName, path.extname(fileName)); // Премахване на разширението
    const fileExtension = path.extname(fileName); // Вземане на разширението
    const newFileName = `${fileBaseName} ${date}${fileExtension}`; // Дата след името на файла
    const destination = path.join(destinationFolder, newFileName);

    fs.rename(source, destination, (err) => {
        if (err) throw err;
        console.log(`Файлът е преместен в: ${destination}`);
    });
}

// Път до папката с файлове
const sourceFolder = 'C:/Users/PC User/Desktop/glasses za puskane/print';
const destinationFolder = 'C:/Users/PC User/Desktop/glasses za puskane/dadeni';

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
