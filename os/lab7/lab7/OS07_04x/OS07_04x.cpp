#include <iostream>
#include <Windows.h>
#include <ctime>

using namespace std;

void findPrimes(HANDLE htimer) {
    int num = 2, i, count = 1;
    bool isPrime;
    time_t startTime = time(nullptr);
    for (num; ; num++) {
        isPrime = true;
        for (i = 2; i * i <= num; ++i) {
            if (num % i == 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            cout << count << ") " << num << endl;
            count++;
            Sleep(200);
        }
        if (WaitForSingleObject(htimer, 0) == WAIT_OBJECT_0) {
            time_t endTime = time(nullptr);
            cout << endTime - startTime << " sec" << endl;
            cout << "Завершение программы" << endl;
            break;
        }
    }

}

int main(int argc, char* argv[])
{
    setlocale(LC_ALL, "rus");
    if (argc != 2) {
        cout << "Нужно ввести 2 аргумента" << endl;
        return 1;
    }

    int duration = atoi(argv[1]);

    HANDLE htimer = CreateWaitableTimer(NULL, FALSE, NULL);

    LARGE_INTEGER li;
    li.QuadPart = -duration * 60 * 10000000;

    if (!SetWaitableTimer(htimer, &li, 0, NULL, NULL, 0)) {
        cerr << "Ошибка создания таймера" << endl;
        return 1;
    }

    findPrimes(htimer);

    system("pause");
    CancelWaitableTimer(htimer);
    CloseHandle(htimer);

    return 0;
}
