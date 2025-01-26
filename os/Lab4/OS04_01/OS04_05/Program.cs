using System;
using System.Diagnostics;

class Program
{
    static void Main(string[] args)
    {
        Stopwatch stopwatch = Stopwatch.StartNew();
        MySleep(10000);
        stopwatch.Stop();

        Console.WriteLine($"Функция MySleep завершилась за: {stopwatch.ElapsedMilliseconds} миллисекунд");

        int coreCount = Environment.ProcessorCount;
        Console.WriteLine($"Количество логических процессоров: {coreCount}");
    }

    static double MySleep(int ms)
    {
        double sum = 0, temp;
        for (int t = 0; t < ms; ++t)
        {
            temp = 0.711 + (double)t / 10000.0;
            double a, b, c, d, e, nt;
            for (int k = 0; k < 50000; ++k)
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
