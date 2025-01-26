const fs = require('fs');

(async () => {
    const { createClient } = await import('webdav');

    const client = createClient('https://webdav.yandex.ru', {
        username: 'nastyagorodilina@yandex.by',
        password: 'prmxktvozzonubuu'
            });

    async function createFolder(folderName) {
        try {
            await client.createDirectory(folderName);
            console.log(`Папка "${folderName}" создана.`);
        } catch (error) {
            console.error('Ошибка создания папки:', error.message);
        }
    }

    async function uploadFile(localPath, remotePath) {
        try {
            const fileData = fs.readFileSync(localPath);
            await client.putFileContents(remotePath, fileData);
            console.log(`Файл "${localPath}" загружен как "${remotePath}".`);
        } catch (error) {
            console.error('Ошибка выгрузки файла:', error.message);
        }
    }

    async function downloadFile(remotePath, localPath) {
        try {
            const fileData = await client.getFileContents(remotePath);
            fs.writeFileSync(localPath, fileData);
            console.log(`Файл "${remotePath}" загружен в "${localPath}".`);
        } catch (error) {
            console.error('Ошибка загрузки файла:', error.message);
        }
    }

    async function copyFile(sourcePath, targetPath) {
        try {
            await client.copyFile(sourcePath, targetPath);
            console.log(`Файл "${sourcePath}" скопирован в "${targetPath}".`);
        } catch (error) {
            console.error('Ошибка копирования файла:', error.message);
        }
    }

    async function deleteFile(remotePath) {
        try {
            await client.deleteFile(remotePath);
            console.log(`Файл "${remotePath}" удалён.`);
        } catch (error) {
            console.error('Ошибка удаления файла:', error.message);
        }
    }

    async function deleteFolder(folderName) {
        try {
            await client.deleteFile(folderName); 
            console.log(`Папка "${folderName}" удалена.`);
        } catch (error) {
            console.error('Ошибка удаления папки:', error.message);
        }
    }

    async function main() {
        const folderName = '/test'; // Имя папки на Яндекс.Диске
        const localFilePath = './lab6.txt'; // Локальный файл
        const remoteFilePath = '/test/lab6.txt'; // Путь к файлу на Яндекс.Диске
        const copiedFilePath = '/test/copy-example.txt'; // Копия файла

        // Создать папку
        //await createFolder(folderName);

        // Выгрузить файл
        //await uploadFile(localFilePath, remoteFilePath);

        // Загрузить файл
        //await downloadFile(remoteFilePath, './example.txt');

        // Копировать файл
        //await copyFile(remoteFilePath, '/laba/copy.txt');

        // Удалить файл
        //await deleteFile(remoteFilePath);
        // Удалить папку
        await deleteFolder(folderName);
    }

    // Запуск основного процесса
    await main();
})().catch(error => console.error('Ошибка выполнения программы:', error.message));
