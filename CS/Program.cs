using System;
using System.IO.Ports;

class Program
{
    static void Main()
    {
        string[] portas = SerialPort.GetPortNames();

        Console.WriteLine("Portas encontradas:");

        foreach (string porta in portas)
        {
            Console.WriteLine(porta);
        }

        Console.ReadLine();
    }
}