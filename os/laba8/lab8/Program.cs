using System;
using System.Diagnostics;

class Program
{
    static void ShowMemoryUsed()
    {
        var memory = 0.0;
        using (Process proc = Process.GetCurrentProcess())
        {
            memory = proc.PrivateMemorySize64 / (1024 * 1024);
        }

        Console.WriteLine($"Используемая память: {memory:F2} MB");
    }

    class LargeObject
    {
        public Int32[] IntArray;
        public LargeObject()
        {
            IntArray = new int[1048576 * 32];
        }
        public void FillWithRandomValues()
        {
            Random rand = new Random();
            for (int i = 0; i < IntArray.Length; i++)
            {
                IntArray[i] = rand.Next();
            }
        }
    }
    static void Main()
    {
        Console.WriteLine("Nastya's Laba\n");

        ShowMemoryUsed();

        var largeObjects = new List<LargeObject>();
        while (true)
        {
            LargeObject largeObject = new LargeObject();
            largeObjects.Add(largeObject);

            Thread fillThread = new Thread(largeObject.FillWithRandomValues);
            fillThread.Start();

            ShowMemoryUsed();
            
            Thread.Sleep(5000);
            
        }
    }
}
