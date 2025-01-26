#include <iostream>
#include <chrono>
#include <ctime>
#include <thread>

using namespace std;

atomic<int> i = 0;

void printIterationsAfterTimeFive() {
	this_thread::sleep_for(chrono::seconds(5));
	cout << "Прошло 5 секунд: " << i << endl;
}

void printIterationsAfterTimeTen() {
	this_thread::sleep_for(chrono::seconds(10));
	cout << "Прошло 10 секунд: " << i << endl;
}

void exitProcess() {
	this_thread::sleep_for(chrono::seconds(15));
	cout << "Прошло 15 секунд, программа завершает работу: " << i << endl;
	exit(0);
}

int main()
{
	setlocale(LC_ALL, "rus");
	thread t1(printIterationsAfterTimeFive);
	thread t2(printIterationsAfterTimeTen);
	thread t3(exitProcess);
	//t1.detach();
	//t2.detach();
	//t3.detach();
	while (true) {
		i++;
	}
	return 0;
}
