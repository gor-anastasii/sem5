#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <sys/resource.h>
#include <signal.h>

int main() {
    // Получаем текущий приоритет (nice)
    int current_nice = getpriority(PRIO_PROCESS, 0);
    printf("Текущий nice: %d\n", current_nice);

    // Длинный цикл
    printf("Запуск длительного цикла. Нажмите Ctrl+C для завершения.\n");
    while (1) {
        // Выполняем какую-то бесполезную работу
        for (volatile int i = 0; i < 1000000; ++i);
    }

    return 0;
}