using System;
using System.Threading;

class Program
{
    static int Count = 0;

    static void WorkThread()
    {
        for (int i = 0; i < 5000000; ++i)
        {
            Count = Count + 1;
        }
    }

    static void Main(string[] args)
    {
        Thread[] threads = new Thread[20];

        for (int i = 0; i < 20; ++i)
        {
            threads[i] = new Thread(WorkThread);
            threads[i].Start();
        }

        for (int i = 0; i < 20; ++i)
        {
            threads[i].Join();
        }

        Console.WriteLine($"Результат переменной Count: {Count}");
        Console.WriteLine($"Ожидаемый результат: {20 * 5000000}");
    }
}
