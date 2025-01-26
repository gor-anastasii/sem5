#include <iostream>
#include <mutex>
#include "Windows.h"

using namespace std;

int main()
{
    const wchar_t* path1 = L"C:\\AllMine\\Labs\\ОС\\lab6\\lab6\\Debug\\OS06_04A.exe";
    const wchar_t* path2 = L"C:\\AllMine\\Labs\\ОС\\lab6\\lab6\\Debug\\OS06_04B.exe";

    HANDLE semaphore;
    semaphore = CreateSemaphore(NULL,2 , 2, L"OS06_04");

    STARTUPINFO si1, si2;
    PROCESS_INFORMATION pi1, pi2;
    ZeroMemory(&si1, sizeof(STARTUPINFO));
    ZeroMemory(&si2, sizeof(STARTUPINFO));
    si1.cb = sizeof(STARTUPINFO);
    si2.cb = sizeof(STARTUPINFO);

    if (CreateProcessW(path1, NULL, NULL, NULL, FALSE, CREATE_NEW_CONSOLE, NULL, NULL, &si1, &pi1))
        cout << "Process OS06_04A created\n";
    else
        cout << "Error(1)\n";

    if (CreateProcessW(path2, NULL, NULL, NULL, FALSE, CREATE_NEW_CONSOLE, NULL, NULL, &si2, &pi2))
        cout << "Process OS06_04B created\n";
    else
        cout << "Error(2)\n";

    for (int i = 1; i <= 90; i++) {

        cout << "Main: " << i << endl;
        if (i == 30) {
            WaitForSingleObject(semaphore, INFINITE);
        }
        else if (i == 60) {
            ReleaseSemaphore(semaphore, 1, NULL);
        }

        Sleep(100);
    }

    CloseHandle(semaphore);
    return 0;
}
