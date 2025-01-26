#include <iostream>
#include <mutex>
#include "Windows.h"

using namespace std;

int main()
{
    const wchar_t* path1 = L"C:\\AllMine\\Labs\\ОС\\lab6\\lab6\\Debug\\OS06_03A.exe";
    const wchar_t* path2 = L"C:\\AllMine\\Labs\\ОС\\lab6\\lab6\\Debug\\OS06_03B.exe";

    HANDLE mutex;
    mutex = CreateMutex(NULL, false, L"OS06_03");

    STARTUPINFO si1, si2;
    PROCESS_INFORMATION pi1, pi2;
    ZeroMemory(&si1, sizeof(STARTUPINFO));
    ZeroMemory(&si2, sizeof(STARTUPINFO));
    si1.cb = sizeof(STARTUPINFO); 
    si2.cb = sizeof(STARTUPINFO);
    
    if (CreateProcessW(path1, NULL, NULL, NULL, FALSE, CREATE_NEW_CONSOLE, NULL, NULL, &si1, &pi1))
        cout << "Process OS06_03A created\n";
    else
        cout << "Error(1)\n";

    if (CreateProcessW(path2, NULL, NULL, NULL, FALSE, CREATE_NEW_CONSOLE, NULL, NULL, &si2, &pi2))
        cout << "Process OS06_03B created\n";
    else
        cout << "Error(2)\n";

    for (int i = 1; i <= 90; i++) {

        if (i == 30) {
            WaitForSingleObject(mutex, INFINITE);
        }
        else if (i == 60) {
            ReleaseMutex(mutex);
        }

        cout << "Main: " << i << endl;
        Sleep(100);
    }

    CloseHandle(mutex);
    return 0;
}
