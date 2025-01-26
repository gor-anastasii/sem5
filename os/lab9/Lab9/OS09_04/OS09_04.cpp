#include <iostream>
#include <fstream>
#include <string>
#include <Windows.h>
#include <Shlwapi.h>
#include <cstdio>
#include <thread>

#pragma comment(lib, "Shlwapi.lib")

#define FILE_PATH L"C:\\AllMine\\Labs\\ОС\\lab9\\OS09_03.txt"
#define DIRECTORY_PATH L"C:\\AllMine\\Labs\\ОС\\lab9"

using namespace std;

int countLines(LPWSTR fileName) {
    ifstream file(fileName);
    if (!file) {
        return 0;
    }
    int lineCount = 0;
    string line;
    while (getline(file, line)) {
        ++lineCount;
    }
    return lineCount;
}

void printWatchRowFileTxt(LPWSTR fileName, int mlsec) {
    HANDLE hDir = CreateFile(DIRECTORY_PATH, FILE_LIST_DIRECTORY, FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS, NULL);

    if (hDir == INVALID_HANDLE_VALUE) {
        wprintf(L"error CreateFile\n");
        return;
    }

    HANDLE hChange = FindFirstChangeNotification(DIRECTORY_PATH, FALSE, FILE_NOTIFY_CHANGE_SIZE | FILE_NOTIFY_CHANGE_LAST_WRITE);

    if (hChange == INVALID_HANDLE_VALUE) {
        wprintf(L"error FindFirstChangeNotification\n");
        CloseHandle(hDir);
        return;
    }

    int previousLineCount = countLines(fileName);
    DWORD waitStatus;

    while (mlsec > 0) {
        waitStatus = WaitForSingleObject(hChange, 500);

        if (waitStatus == WAIT_OBJECT_0) {
            int currentLineCount = countLines(fileName);
            if (currentLineCount != previousLineCount) {
                wprintf(L"rows amount: %d >>> %d\n", previousLineCount, currentLineCount);
                previousLineCount = currentLineCount;
            }
            FindNextChangeNotification(hChange);
        }

        mlsec -= 500;
    }

    FindCloseChangeNotification(hChange);
    CloseHandle(hDir);
}

int main() {
    SetConsoleOutputCP(CP_UTF8);

    printWatchRowFileTxt((LPWSTR)FILE_PATH, 100000);

    return 0;
}