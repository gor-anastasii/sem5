class Program
{
    // Настройки
    static readonly int TaskCount = Environment.ProcessorCount; // Количество задач = количеству логических процессоров
    const int TaskLifeTime = 10;  // Время жизни задачи в секундах
    const int ObservationTime = 30; // Время наблюдения в секундах
    static int[,] Matrix = new int[TaskCount, ObservationTime];
    static DateTime StartTime = DateTime.Now;

    static void Main(string[] args)
    {
        Task[] t = new Task[TaskCount];
        int[] numbers = new int[TaskCount];

        // Инициализация массива чисел
        for (int i = 0; i < TaskCount; i++)
            numbers[i] = i;

        Console.WriteLine("Настя Городилина создает задачи...");

        // Создание и запуск задач по очереди с использованием ContinueWith
        t[0] = new Task(() => { Work(0); });
        t[0].Start(); // Запускаем первую задачу

        for (int i = 1; i < TaskCount; i++)
        {
            int taskId = numbers[i];
            t[i] = t[i - 1].ContinueWith(_ => Work(taskId));
        }

        Console.WriteLine("Настя Городилина ожидает завершения задач...");
        Task.WaitAll(t); // Ожидание завершения всех задач

        // Вывод результата в виде таблицы
        Console.WriteLine("Время (с)  | Задача 0 | Задача 1 | Задача 2 | Задача 3 |");
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
