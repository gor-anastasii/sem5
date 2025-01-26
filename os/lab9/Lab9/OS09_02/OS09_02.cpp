#include <iostream>
#include <fstream>
#include <string>
#include <Windows.h>
#include <Shlwapi.h>

#pragma comment(lib, "Shlwapi.lib")

#define PATH L"C:\\AllMine\\Labs\\ОС\\lab9\\OS09_02.txt"

using namespace std;

BOOL printFileTxt(LPWSTR fileName) {
    HANDLE hFile = CreateFile(fileName, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);

    if (hFile == INVALID_HANDLE_VALUE) {
        DWORD error = GetLastError();
        wprintf(L"Error CreateFile: %s\n", fileName);
        return FALSE;
    }

    DWORD bytesRead;
    const DWORD bufferSize = 1024;
    char buffer[bufferSize + 1];

    wprintf(L"\nFILE CONTENT:\n");

    while (ReadFile(hFile, buffer, bufferSize, &bytesRead, NULL) && bytesRead > 0) {
        buffer[bytesRead] = '\0';
        printf("%s", buffer);
    }

    CloseHandle(hFile);
    return TRUE;
}

BOOL delRowFileTxt(LPWSTR FileName, DWORD row) {
    if (row <= 0) {
        wprintf(L"row <= 0\n");
        return false;
    }

    HANDLE fileHandle = CreateFile(FileName, GENERIC_READ | GENERIC_WRITE, FILE_SHARE_READ, NULL, OPEN_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (fileHandle == INVALID_HANDLE_VALUE) {
        wprintf(L"error Createfile\n");
        return false;
    }

    LARGE_INTEGER fileSize;
    if (!GetFileSizeEx(fileHandle, &fileSize)) {
        CloseHandle(fileHandle);
        wprintf(L"error GetFileSizeEx\n");
        return false;
    }

    unique_ptr<char[]> buf(new char[fileSize.QuadPart + 1]);
    DWORD bytesRead;
    if (!ReadFile(fileHandle, buf.get(), fileSize.QuadPart, &bytesRead, NULL)) {
        CloseHandle(fileHandle);
        wprintf(L"error ReadFile\n");
        return false;
    }
    buf[fileSize.QuadPart] = '\0';

    string result;
    int rowCount = 1;
    char* ptr = buf.get();

    while (*ptr) {
        if (rowCount == row) {
            while (*ptr && *ptr != '\n') {
                ptr++;
            }
            if (*ptr == '\n') ptr++;
            rowCount++;
        }
        else {
            while (*ptr && *ptr != '\n') {
                result += *ptr++;
            }
            result += '\n';
            if (*ptr == '\n') ptr++;
            rowCount++;
        }
    }

    SetFilePointer(fileHandle, 0, 0, FILE_BEGIN);
    DWORD bytesWritten;
    if (!WriteFile(fileHandle, result.c_str(), result.size(), &bytesWritten, NULL) ||
        !SetEndOfFile(fileHandle)) {
        CloseHandle(fileHandle);
        wprintf(L"error WriteFile/SetEndOfFile\n");
        return false;
    }

    CloseHandle(fileHandle);
    return true;
}


int main() {
    SetConsoleOutputCP(CP_UTF8);

    wprintf(L"BEFORE:\n");
    printFileTxt((LPWSTR)PATH);

    wprintf(L"\n");
    delRowFileTxt((LPWSTR)PATH, (DWORD)1);
    delRowFileTxt((LPWSTR)PATH, (DWORD)3);
    delRowFileTxt((LPWSTR)PATH, (DWORD)8);
    delRowFileTxt((LPWSTR)PATH, (DWORD)10);
    wprintf(L"\n");

    wprintf(L"AFTER:\n");
    printFileTxt((LPWSTR)PATH);

    return 0;
}