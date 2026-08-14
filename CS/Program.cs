using System;
using System.IO.Ports;
using System.Management;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        string portaSTM = EncontrarPortaSTM();

        if(portaSTM == null)
        {
            Console.WriteLine("STM32 não encontrado");
            return;
        }

        Console.WriteLine("STM32 encontrado em: " + portaSTM);

        SerialPort porta = new SerialPort(
            portaSTM,
            115200
        );

        porta.NewLine = "\n";

        porta.Open();

        using HttpClient cliente =
            new HttpClient();

        Console.WriteLine(
            "Aguardando dados do STM32..."
        );

        while(true)
        {
            string mensagem =
                porta.ReadLine().Trim();

            Console.WriteLine(
                "Recebido: " + mensagem
            );

            StringContent conteudo =
                new StringContent(
                    mensagem,
                    Encoding.UTF8,
                    "application/json"
                );

            HttpResponseMessage resposta =
                await cliente.PostAsync(
                    "http://localhost:3000/medicao",
                    conteudo
                );

            string retorno =
                await resposta.Content.ReadAsStringAsync();

            Console.WriteLine(
                "Resposta: " + retorno
            );

            Console.WriteLine();
        }
    }

    static string EncontrarPortaSTM()
    {
        ManagementObjectSearcher pesquisa =
            new ManagementObjectSearcher(
                "SELECT * FROM Win32_PnPEntity"
            );

        foreach(
            ManagementObject dispositivo
            in pesquisa.Get()
        )
        {
            string id =
                dispositivo["PNPDeviceID"]?.ToString();

            string nome =
                dispositivo["Name"]?.ToString();

            if(
                id != null &&
                nome != null &&
                id.Contains("VID_0483") &&
                id.Contains("PID_5740") &&
                nome.Contains("(COM")
            )
            {
                int inicio =
                    nome.IndexOf("(COM") + 1;

                int fim =
                    nome.IndexOf(
                        ")",
                        inicio
                    );

                string porta =
                    nome.Substring(
                        inicio,
                        fim - inicio
                    );

                return porta;
            }
        }

        return null;
    }
}