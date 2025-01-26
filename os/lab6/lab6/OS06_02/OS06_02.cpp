#include <windows.h>
#include <iostream>

using namespace std;

CRITICAL_SECTION cs;

DWORD WINAPI thread(char* lpParam) {

    for (int i = 1; i <= 90; ++i) {

        if (i == 30) {
            EnterCriticalSection(&cs);
        }
        else if (i == 60) {
            LeaveCriticalSection(&cs);
        }

        cout << lpParam << ": " << i << endl;


        Sleep(100);
    }

    return 0;
}


int main() {
    HANDLE hThread1, hThread2;

    hThread1 = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)thread, (char*)"A", 0, NULL);
    hThread2 = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)thread, (char*)"B", 0, NULL);

    InitializeCriticalSection(&cs);

    thread((char*)"main");

    WaitForSingleObject(hThread1, INFINITE);
    WaitForSingleObject(hThread2, INFINITE);
    CloseHandle(hThread1);
    CloseHandle(hThread2);

    DeleteCriticalSection(&cs);
    return 0;
}