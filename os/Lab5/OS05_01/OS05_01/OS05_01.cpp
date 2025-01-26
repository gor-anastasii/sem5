#include <windows.h>
#include <iostream>
#include <iomanip>
using namespace std;

int main()
{
	HANDLE processHandle = GetCurrentProcess();
	HANDLE threadHandle = GetCurrentThread();
	DWORD pid = GetCurrentProcessId();
	DWORD tid = GetCurrentThreadId();
	cout << "Main PID: " << pid << endl;
	cout << "Main TID: " << tid << endl;
	DWORD processPriority = GetPriorityClass(processHandle);
	switch (processPriority)
	{
	case IDLE_PRIORITY_CLASS: cout << "Process priority: IDLE\n"; break;
	case NORMAL_PRIORITY_CLASS: cout << "Process priority: NORMAL\n"; break;
	case HIGH_PRIORITY_CLASS: cout << "Process priority: HIGH\n"; break;
	case REALTIME_PRIORITY_CLASS: cout << "Process priority: REALTIME\n"; break;
	case BELOW_NORMAL_PRIORITY_CLASS: cout << "Process priority: BELOW_NORMAL\n"; break;
	case ABOVE_NORMAL_PRIORITY_CLASS: cout << "Process priority: ABOVE_NORMAL\n"; break;
	default: cout << "Process priority: ???\n"; break;
	}
	DWORD threadPriority = GetThreadPriority(threadHandle);
	switch (threadPriority)
	{
	case THREAD_PRIORITY_LOWEST: cout << "Thread priority: LOWEST\n"; break;
	case THREAD_PRIORITY_BELOW_NORMAL: cout << "Thread priority: TBELOW_NORMAL\n"; break;
	case THREAD_PRIORITY_NORMAL: cout << "Thread priority: NORMAL\n"; break;
	case THREAD_PRIORITY_ABOVE_NORMAL:cout << "Thread priority: ABOVE_NORMAL\n"; break;
	case THREAD_PRIORITY_HIGHEST: cout << "Thread priority: HIGHEST\n"; break;
	case THREAD_PRIORITY_IDLE: cout << "Thread priority: IDLE\n"; break;
	default:cout << "Thread priority: ???\n"; break;
	}
	DWORD_PTR pa = NULL, sa = NULL;
	char buf[10];
	if (!GetProcessAffinityMask(processHandle, &pa, &sa))
		throw "Error";
	_itoa_s(pa, buf, 2);
	cout << "Process affinity mask: " << buf;
	cout << " (" << showbase << hex << pa << ")" << endl;
	_itoa_s(sa, buf, 2);
	SYSTEM_INFO sys_info;
	GetSystemInfo(&sys_info);
	cout << "Max processors count:  " << dec << sys_info.dwNumberOfProcessors << endl;
	cout << "Thread IdealProcessor: " << dec << SetThreadIdealProcessor(threadHandle, MAXIMUM_PROCESSORS) << endl;
	system("pause");
}
