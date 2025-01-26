#include <iostream>
#include <mutex>
#include "Windows.h"

using namespace std;

int main()
{
    HANDLE semaphore;
    semaphore = CreateSemaphore(NULL, 2, 2, L"OS06_04");

    for (int i = 1; i <= 90; i++) {

        cout << "OS06_04A: " << i << endl;
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
