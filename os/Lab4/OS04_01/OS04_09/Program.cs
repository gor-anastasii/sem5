using System;
using System.Threading;

class Program
{
    // Настройки
    const int TaskCount = 10;     // Количество задач
    const int TaskLifeTime = 10;  // Время жизни задачи в секундах
    const int ObservationTime = 30; // Время наблюдения в секундах
    static int[,] Matrix = new int[TaskCount, ObservationTime];
    static DateTime StartTime = DateTime.Now;

    static void Main(string[] args)
    {
        Console.WriteLine("Настя создает задачи...");

        Task[] tasks = new Task[TaskCount];

        // Запуск задач
        for (int i = 0; i < TaskCount; i++)
        {
            int taskId = i; // локальная копия переменной
            tasks[i] = Task.Run(() => Work(taskId));
        }

        Console.WriteLine("Настя ожидает завершения задач...");
        Task.WaitAll(tasks); // Ожидание завершения всех задач

        // Вывод результата в виде таблицы
        Console.WriteLine("Время (с)  | Задача 0 | Задача 1 | Задача 2 | Задача 3 | Задача 4 | Задача 5 | Задача 6 | Задача 7 | Задача 8 | Задача 9 |");
        Console.WriteLine("-------------------------------------------------------------");
        for (int s = 0; s < ObservationTime; s++)
        {
            Console.Write($"{s,3}:      |");
            for (int th = 0; th < TaskCount; th++)
            {
                Console.Write($" {Matrix[th, s],5} |");
            }
            Console.WriteLine();
        }
    }

    static void Work(int id)
    {
        DateTime taskStartTime = DateTime.Now;

        while ((DateTime.Now - taskStartTime).TotalSeconds < TaskLifeTime)
        {
            DateTime currentTime = DateTime.Now;
            int elapsedSeconds = (int)(currentTime - StartTime).TotalSeconds;

            if (elapsedSeconds < ObservationTime)
            {
                Matrix[id, elapsedSeconds] += 50; // Увеличиваем значение в матрице
            }

            MySleep(50); // Вызов метода, который занимает время
        }
    }

    static Double MySleep(int ms)
    {
        Double sum = 0, temp;
        for (int t = 0; t < ms; ++t)
        {
            temp = 0.711 + (double)t / 10000.0;
            double a, b, c, d, e, nt;
            for (int k = 0; k < 5500; ++k)
            {
                nt = temp - k / 27000.0;
                a = Math.Sin(nt);
                b = Math.Cos(nt);
                c = Math.Cos(nt / 2.0);
                d = Math.Sin(nt / 2);
                e = Math.Abs(1.0 - a * a - b * b) + Math.Abs(1.0 - c * c - d * d);
                sum += e;
            }
        }
        return sum;
    }
}