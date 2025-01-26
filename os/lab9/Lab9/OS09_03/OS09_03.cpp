#include <iostream>
#include <fstream>
#include <string>
#include <Windows.h>
#include <Shlwapi.h>
#include <cstdio>

#pragma comment(lib, "Shlwapi.lib")

#define PATH L"C:\\AllMine\\Labs\\ОС\\lab9\\OS09_03.txt"

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

    wprintf(L"FILE CONTENT:\n");

    while (ReadFile(hFile, buffer, bufferSize, &bytesRead, NULL) && bytesRead > 0) {
        buffer[bytesRead] = '\0';
        printf("%s", buffer);
    }

    CloseHandle(hFile);
    return TRUE;
}

BOOL insRowFileTxt(LPWSTR fileName, LPWSTR str, DWORD row) {
    HANDLE fileHandle = CreateFile(fileName, GENERIC_READ | GENERIC_WRITE, FILE_SHARE_READ, NULL, OPEN_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (fileHandle == INVALID_HANDLE_VALUE) {
        wprintf(L"error CreateFile\n");
        return FALSE;
    }

    LARGE_INTEGER fileSize;
    if (!GetFileSizeEx(fileHandle, &fileSize)) {
        CloseHandle(fileHandle);
        wprintf(L"error GetFileSizeEx\n");
        return FALSE;
    }

    int strLength = wcslen(str);
    int bufferSize = WideCharToMultiByte(CP_UTF8, 0, str, strLength, NULL, 0, NULL, NULL);
    string insertStr(bufferSize, '\0');
    WideCharToMultiByte(CP_UTF8, 0, str, strLength, &insertStr[0], bufferSize, NULL, NULL);

    string buf(fileSize.QuadPart, '\0');
    DWORD bytesRead;

    if (!ReadFile(fileHandle, &buf[0], fileSize.QuadPart, &bytesRead, NULL)) {
        CloseHandle(fileHandle);
        wprintf(L"error ReadFile\n");
        return FALSE;
    }

    string result;
    int rowCount = 0;
    size_t position = 0;
    bool rowFound = false;

    while (position < buf.size()) {
        if (rowCount == row) {
            result += insertStr + "\r\n";
            rowFound = true;
        }
        while (position < buf.size() && buf[position] != '\n') {
            result += buf[position++];
        }
        if (position < buf.size()) {
            result += '\n';
            position++;
        }
        rowCount++;
    }

    if (row == MAXDWORD) {
        result += insertStr + "\r\n";
        rowFound = true;
    }

    if (rowFound) {
        SetFilePointer(fileHandle, 0, 0, FILE_BEGIN);
        DWORD bytesWritten;
        if (!WriteFile(fileHandle, result.c_str(), result.size(), &bytesWritten, NULL) ||
            !SetEndOfFile(fileHandle)) {
            CloseHandle(fileHandle);
            wprintf(L"error WriteFile/SetEndOfFile\n");
            return FALSE;
        }
    }

    CloseHandle(fileHandle);
    return TRUE;
}


int main() {
    SetConsoleOutputCP(CP_UTF8);

    wprintf(L"BEFORE:\n");
    printFileTxt((LPWSTR)PATH);

    wprintf(L"\n");
    insRowFileTxt((LPWSTR)PATH, (LPWSTR)L"Балабановская Ксения", 0);
    insRowFileTxt((LPWSTR)PATH, (LPWSTR)L"Никоненко Андрей", -1);
    insRowFileTxt((LPWSTR)PATH, (LPWSTR)L"Ворович Кирилл", 5);
    insRowFileTxt((LPWSTR)PATH, (LPWSTR)L"Хатченок Дмитрий", 7);
    wprintf(L"\n");

    wprintf(L"AFTER:\n");
    printFileTxt((LPWSTR)PATH);

    return 0;
}