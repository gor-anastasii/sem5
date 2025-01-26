using System;
using System.Threading;

class Program
{
    // Настройки
    const int ThreadCount = 10;     // Количество потоков
    const int ThreadLifeTime = 10;  // Время жизни потока в секундах
    const int ObservationTime = 30;  // Время наблюдения в секундах
    static int[,] Matrix = new int[ThreadCount, ObservationTime];
    static DateTime StartTime = DateTime.Now;

    static void Main(string[] args)
    {
        Console.WriteLine("Студент Городилина помещает потоки в пул...");

        // Запуск потоков из пула
        for (int i = 0; i < ThreadCount; ++i)
        {
            int threadId = i; // локальная копия переменной
            ThreadPool.QueueUserWorkItem(WorkThread, threadId);
        }

        Console.WriteLine("Студент Городилина ожидает завершения потоков...");
        Thread.Sleep(1000 * ObservationTime); // Ожидание завершения потоков

        // Вывод результата в виде таблицы
        Console.WriteLine("Время (с)  | Поток 0 | Поток 1 | Поток 2 | Поток 3 | Поток 4 | Поток 5 | Поток 6 | Поток 7 | Поток 8 | Поток 9 |");
        Console.WriteLine("-------------------------------------------------------------");
        for (int s = 0; s < ObservationTime; s++)
        {
            Console.Write($"{s,3}:      |");
            for (int th = 0; th < ThreadCount; th++)
            {
                Console.Write($" {Matrix[th, s],5} |");
            }
            Console.WriteLine();
        }
    }

    static void WorkThread(object o)
    {
        int id = (int)o;
        DateTime threadStartTime = DateTime.Now;

        while ((DateTime.Now - threadStartTime).TotalSeconds < ThreadLifeTime)
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
