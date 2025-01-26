using System;
using System.Threading;

class Program
{
    static void ThreadZed()
    {
        for (int i = 0; i < 10; i++)
        {
            Console.WriteLine("Поток Z: " + i);
            Thread.Sleep(1000);
        }
        Console.WriteLine("Поток Z завершается");
    }

    static void ThreadWithParam(object o)
    {
        for (int i = 0; i < 20; i++)
        {
            Console.WriteLine($"Поток {o}: {i}");
            Thread.Sleep(1000);
        }
        Console.WriteLine($"Поток {o} завершается");
    }

    static void Main(string[] args)
    {
        Thread t1 = new Thread(ThreadZed);
        Thread t2 = new Thread(ThreadWithParam);
        Thread t3 = new Thread(ThreadWithParam);

        t1.IsBackground = true; // false для п.11
        t2.IsBackground = false; // false для п.12
        t3.IsBackground = true;

        t1.Start();
        t2.Start("Анастасия"); // Имя
        t3.Start("Городилина"); // Фамилия
                           // Главный поток работает 5 секунд
        for (int i = 0; i < 5; i++)
        {
            Console.Write(" (*-{0}) ", Thread.CurrentThread.ManagedThreadId);
            Thread.Sleep(1000);
        }
        Console.WriteLine("Главный поток завершается");

        //// Ожидание завершения всех потоков
        //t1.Join();
        //t2.Join();
        //t3.Join();
    }
}
