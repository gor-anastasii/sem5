#define _CRT_SECURE_NO_WARNINGS

#include <iostream>
#include <chrono>
#include <iomanip>
#include <ctime>
using namespace std;


int main()
{
    auto now = chrono::system_clock::now();
    time_t now_c = chrono::system_clock::to_time_t(now);
    tm* local_time = localtime(&now_c);

    cout << put_time(local_time, "%d.%m.%y %H:%M:%S") << endl;

    return 0;
}
