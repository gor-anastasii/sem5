#include <stdio.h>      // Для printf
#include <stdlib.h>     // Для exit
#include <unistd.h>     // Для sleep и getpid
#include <pthread.h>    // Для POSIX потоков
#include <sys/syscall.h> // Для syscall
#include <sys/types.h> 

void* Thread(void* arg)
{
	pid_t pid = getpid();
	pid_t tid = syscall(SYS_gettid);
	for (int i = 1; i <= 75; ++i)
	{
		printf("%d. PID = %d, ID of thread = %d\n", i, pid, tid);
		sleep(1);
	}
	pthread_exit("Child thread");
}
int main()
{
	pid_t pid = getpid();
	pid_t tid = syscall(SYS_gettid);
	pthread_t a_thread;
	void* thread_result;
	int res = pthread_create(&a_thread, NULL, Thread, NULL);

	for (int i = 1; i <= 100; ++i)
	{
		printf("%d. PID = %d, Thread main ID = %d\n", i, pid, tid);
		sleep(1);
	}

	int status = pthread_join(a_thread, (void**)&thread_result);
	exit(0);
}
