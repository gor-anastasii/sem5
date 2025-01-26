#include <windows.h>
#include <iostream>

using namespace std;

int bit;

DWORD WINAPI thread(char lpParam) {

    _asm
    {
    getsem:
        lock bts bit, 0;
        jc getsem
    }

    for (int i = 0; i < 10; ++i) {
        cout << lpParam << " TID: " << GetCurrentThreadId() << endl;
        Sleep(500);
    }

    _asm lock btr bit, 0

    return 0;
}


int main() {
    HANDLE hThread1, hThread2;

    hThread1 = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)thread, (char*)'1', 0, NULL);
    hThread2 = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)thread, (char*)'2', 0, NULL);

    WaitForSingleObject(hThread1, INFINITE);
    WaitForSingleObject(hThread2, INFINITE);
    CloseHandle(hThread1);
    CloseHandle(hThread2);
    return 0;
}