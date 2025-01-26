#include <iostream>
#include <pthread.h>
#include <unistd.h>
#include <sched.h>
#include <vector>

int main() {
    // Идентификатор текущего процесса
    pid_t processId = getpid();

    // Идентификатор текущего потока
    pthread_t threadId = pthread_self();

    // Приоритет (nice) текущего потока
    int niceValue = nice(0); // Получаем текущий nice-уровень

    // Получаем количество доступных процессоров
    int numProcessors = sysconf(_SC_NPROCESSORS_ONLN);

    // Вывод информации
    std::cout << "Идентификатор текущего процесса: " << processId << std::endl;
    std::cout << "Идентификатор текущего (main) потока: " << threadId << std::endl;
    std::cout << "Приоритет (nice) текущего потока: " << niceValue << std::endl;
    std::cout << "Количество доступных процессоров: " << numProcessors << std::endl;

    std::cout << "Номера доступных процессоров: ";
    for (int i = 0; i < numProcessors; ++i) {
        std::cout << i << " ";
    }
    std::cout << std::endl;

    return 0;
}