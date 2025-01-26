#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <windows.h>

HANDLE hFile = INVALID_HANDLE_VALUE;
char* buffer = NULL;
DWORD bufferSize;
int rowNum = 0;

// Функция для открытия файла
void OpenFileMy(LPSTR filePath) {
    if (hFile != INVALID_HANDLE_VALUE) {
        puts("Сначала закройте предыдущий файл");
        return;
    }
    hFile = CreateFileA(filePath, 
        GENERIC_READ | GENERIC_WRITE, 
        0, NULL, 
        OPEN_EXISTING, 
        FILE_ATTRIBUTE_NORMAL, 
        NULL
    );
    if (hFile == INVALID_HANDLE_VALUE) {
        puts("Не удается открыть файл");
        return;
    }
    bufferSize = GetFileSize(hFile, NULL);
    buffer = (char*)malloc(bufferSize + 1);
    buffer[bufferSize] = '\0';
    ReadFile(hFile, buffer, bufferSize, NULL, NULL);
    int remCounter = 0;
    for (int i = 0; i < bufferSize; i++) {
        if (buffer[i] == '\n') {
            rowNum++;
        }
    }
    if (buffer[bufferSize - 1] != '\n') {
        rowNum++;
    }
}

void AddRow(HANDLE hFile, LPSTR row, int pos) {
    if (hFile == INVALID_HANDLE_VALUE) {
        puts("Файл не открыт");
        return;
    }
    if ((pos > rowNum + 1) || (pos < -1)) {
        puts("Неверный индекс");
        return;
    }
    if (pos != -1 && pos != 0) {
        pos--;
    }

    if (pos == -1) {
        pos = rowNum;
    }
    int rows = 0;
    char* newBuffer = (char*)malloc(bufferSize + strlen(row) + 2);
    int bi = 0;
    int nbi = 0;
    for (int i = 0; i < bufferSize; i++) {
        if (rows == pos) {
            break;
        }
        newBuffer[nbi] = buffer[bi];
        if (buffer[bi] == '\n') {
            rows++;
        }
        nbi++;
        bi++;
    }

    if (pos == rowNum) {
        if (buffer[bi] != '\n') {
            newBuffer[nbi] = '\n';
            nbi++;
        }
        for (int i = 0; i < strlen(row); i++) {
            newBuffer[nbi] = row[i];
            nbi++;
        }
    }
    else {
        for (int i = 0; i < strlen(row); i++) {
            newBuffer[nbi] = row[i];
            nbi++;
        }

        newBuffer[nbi] = '\n';
        nbi++;
    }

    for (int i = bi; i < bufferSize; i++) {
        newBuffer[nbi] = buffer[i];
        nbi++;
    }

    newBuffer[nbi] = '\0';

    buffer = newBuffer;
    bufferSize = strlen(buffer);

    SetFilePointer(hFile, 0, 0, FILE_BEGIN);
    SetEndOfFile(hFile);
    SetFilePointer(hFile, 0, 0, FILE_BEGIN);
    WriteFile(hFile, buffer, bufferSize, NULL, NULL);
    rowNum++;
}

void RemRow(HANDLE hFile, INT pos) {
    if (hFile == INVALID_HANDLE_VALUE || buffer == NULL) {
        puts("Файл не открыт");
        return;
    }
    if ((pos > rowNum) || (pos < -1)) {
        puts("Неверный индекс");
        return;
    }
    if (pos != -1 && pos != 0) {
        pos--;
    }
    if (pos == -1) {
        pos = rowNum - 1;
    }
    int rows = 0;
    int startPos = 0;
    for (int i = 0; i < bufferSize; i++) {
        if (rows == pos) {
            break;
        }
        if (buffer[i] == '\n') {
            rows++;
        }
        startPos++;
    }

    int endPos = startPos;
    while (buffer[endPos] != '\n' && endPos <= bufferSize) {
        endPos++;
    }

    if (pos == rowNum - 1) {
        startPos--;
    }
    int deleteSize = endPos - startPos;
    char* newBuffer = (char*)malloc(bufferSize - deleteSize + 2);

    int nbi = 0;
    for (int i = 0; i < bufferSize; i++) {
        if (i >= startPos && i <= endPos) {
            continue;
        }
        newBuffer[nbi] = buffer[i];
        nbi++;
    }
    newBuffer[nbi] = '\0';
    buffer = newBuffer;
    bufferSize = strlen(buffer);

    SetFilePointer(hFile, 0, 0, FILE_BEGIN);
    SetEndOfFile(hFile);
    SetFilePointer(hFile, 0, 0, FILE_BEGIN);
    WriteFile(hFile, buffer, bufferSize, NULL, NULL);
    rowNum--;
}

void PrintRow(HANDLE hFile, int pos) {
    if (hFile == INVALID_HANDLE_VALUE) {
        puts("Файл не открыт");
        return;
    }

    if ((pos > rowNum) || (pos < -1)) {
        puts("Неверный индекс");
        return;
    }

    if (pos > 0) {
        pos--;
    }
    if (pos == -1) {
        pos = rowNum - 1;
    }
    int rows = 0;
    for (int i = 0; i < bufferSize; i++) {
        if (rows == pos) {
            printf("%c", buffer[i]);
        }
        if (buffer[i] == '\n') {
            rows++;
        }
    }
    puts("\n");

}

void PrintRows(HANDLE hFile) {
    if (hFile == INVALID_HANDLE_VALUE) {
        puts("Файл не открыт");
        return;
    }

    printf("%s\n", buffer);
}

void CloseFile() {
    if (hFile != INVALID_HANDLE_VALUE) {
        CloseHandle(hFile);

        hFile = INVALID_HANDLE_VALUE;

        free(buffer);
        buffer = NULL;
    }
    else {
        puts("Файл не открыт");
    }
}

int main() {
    SetConsoleCP(65001);
    SetConsoleOutputCP(65001);
    int choice;
    char filePath[MAX_PATH];
    char row[256];
    int pos;

    while (1) {
        printf("Меню:\n");
        printf("1. Открыть файл\n");
        printf("2. Добавить строку\n");
        printf("3. Удалить строку\n");
        printf("4. Вывести строку\n");
        printf("5. Вывести все строки\n");
        printf("6. Закрыть файл\n");
        printf("7. Выйти\n");
        printf("Выберите действие: \n");
        scanf("%d", &choice);

        switch (choice) {
        case 1:
            printf("Введите путь к файлу: \n");
            SetConsoleCP(1251);
            SetConsoleOutputCP(1251);
            scanf(" %[^\n]s\n", filePath);
            printf(filePath);
            SetConsoleCP(65001);
            SetConsoleOutputCP(65001);
            OpenFileMy(filePath);
            break;
        case 2:
            printf("Введите строку: ");
            scanf("%s", row);
            while (getchar() != '\n') {}
            printf("Введите позицию: ");
            scanf("%5d", &pos);
            //while (getchar() != '\n') {}
            AddRow(hFile, row, pos);
            break;
        case 3:
            printf("Введите позицию: ");
            scanf("%5d", &pos);
            //while (getchar() != '\n') {}
            RemRow(hFile, pos);
            break;
        case 4:
            printf("Введите позицию: ");
            scanf("%5d", &pos);
            //while (getchar() != '\n') {}
            PrintRow(hFile, pos);
            break;
        case 5:
            PrintRows(hFile);
            break;
        case 6:
            CloseFile();
            break;
        case 7:
            CloseFile(hFile);
            return 0;
        default:
            printf("Неверный выбор\n");
        }
        while (getchar() != '\n') {}
    }

    return 0;
}
