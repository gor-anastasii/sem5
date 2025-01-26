#include <iostream>
#include <mutex>
#include "Windows.h"

using namespace std;

int main()
{
    HANDLE event;
    event = CreateEvent(NULL, FALSE, FALSE, L"OS06_05");

    for (int i = 1; i <= 90; i++) {

        WaitForSingleObject(event, INFINITE);
        SetEvent(event);
        cout << "OS06_05A: " << i << endl;

        Sleep(100);
    }

    CloseHandle(event);

    return 0;
}
