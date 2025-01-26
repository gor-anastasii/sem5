#include <iostream>
#include <chrono>
#include <ctime>
#include <thread>
#include <Windows.h>

using namespace std;

int i = 0;
bool flag = true;


void printIterationsAfterTime();
void timerThread(HANDLE htimer);
void exitProcess();

int main()
{
	setlocale(LC_ALL, "rus");

	HANDLE htimer = CreateWaitableTimer(NULL, FALSE, NULL);
	LARGE_INTEGER it;
	it.QuadPart = 3000 * 10000;

	if (!SetWaitableTimer(htimer, &it, 3000, NULL, NULL, TRUE)) {
		cout << "Ошибка создания таймера" << endl;
		return 1;
	}

	thread t(timerThread, htimer);
	thread t1(exitProcess);
	t.detach();
	t1.detach();
	while (true) {
		i++;
		Sleep(100);
	}

	CancelWaitableTimer(htimer);
	CloseHandle(htimer);
	return 0;
}

void printIterationsAfterTime() {
	cout << "Прошло 3 секунды: " << i << endl;
}

void timerThread(HANDLE htimer) {
	while (true) {
		WaitForSingleObject(htimer, INFINITE);
		if (flag) {
			flag = false;
			continue;
		}
		printIterationsAfterTime();
	}
}

void exitProcess() {
	this_thread::sleep_for(chrono::seconds(15));
	cout << "Прошло 15 секунд, программа завершает работу: " << i << endl;
	exit(0);
}