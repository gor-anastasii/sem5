#include <iostream>
#include <Windows.h>
#include <process.h>
#include <vector>
#include <string>

using namespace std;

int main() {
    setlocale(LC_ALL, "rus");

    const wchar_t* path = L"C:\\AllMine\\Labs\\ОС\\lab7\\lab7\\Debug\\OS07_04x.exe";

    vector<PROCESS_INFORMATION> pInfo(2);
    vector<STARTUPINFO> sInfo(2);

    for (int i = 0; i < 2; ++i) {
        ZeroMemory(&sInfo[i], sizeof(STARTUPINFO));
        sInfo[i].cb = sizeof(STARTUPINFO);
        ZeroMemory(&pInfo[i], sizeof(PROCESS_INFORMATION));

        wchar_t args[100];
        swprintf(args, sizeof(args) / sizeof(wchar_t), L"%d", i + 1);

        wchar_t command[200];
        swprintf(command, sizeof(command) / sizeof(wchar_t), L"%s %s", path, args);

        if (!CreateProcess(NULL, command, NULL, NULL, FALSE, CREATE_NEW_CONSOLE, NULL, NULL, &sInfo[i], &pInfo[i])) {
            wcout << L"Ошибка при создании процесса: " << GetLastError() << endl;
            return 1;
        }
    }

    WaitForSingleObject(pInfo[0].hProcess, INFINITE);
    WaitForSingleObject(pInfo[1].hProcess, INFINITE);

    for (int i = 0; i < 2; ++i) {
        CloseHandle(pInfo[i].hProcess);
        CloseHandle(pInfo[i].hThread);
    }
    
    return 0;
}