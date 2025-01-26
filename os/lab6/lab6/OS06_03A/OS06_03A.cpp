#include <iostream>
#include <mutex>
#include "Windows.h"

using namespace std;

int main()
{
    HANDLE mutex;
    mutex = CreateMutex(NULL, false, L"OS06_03");

    for (int i = 1; i <= 90; i++) {

        if (i == 30) {
            WaitForSingleObject(mutex, INFINITE);
        }
        else if (i == 60) {
            ReleaseMutex(mutex);
        }

        cout << "OS06_03A: " << i << endl;
        Sleep(100);
    }

    CloseHandle(mutex);

    return 0;
}
