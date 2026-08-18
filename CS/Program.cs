using System;
using System.IO;
using System.IO.Ports;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        bool usarVercel = true;

        string urlServidor;

        if(usarVercel)
        {
            urlServidor =
                "https://projeto-integrado2-beryl.vercel.app/api/medicao";
        }
        else
        {
            urlServidor =
                "http://localhost:3000/medicao";
        }

        string nomePorta =
            EncontrarSTM32();

        if(nomePorta == null)
        
        {
            Console.WriteLine(
                "STM32 não encontrado"
            );

            return;
        }

        Console.WriteLine();
        Console.WriteLine(
            "STM32 encontrado em: "
            + nomePorta
        );

        Console.WriteLine();

        if(usarVercel)
        {
            Console.WriteLine(
                "Servidor: Vercel"
            );
        }
        else
        {
            Console.WriteLine(
                "Servidor: Localhost"
            );
        }

        Console.WriteLine(
            "URL: " + urlServidor
        );

        Console.WriteLine();

        SerialPort porta =
            new SerialPort(
                nomePorta,
                115200
            );

        porta.NewLine = "\n";
        porta.ReadTimeout = 3000;

        porta.Open();

        using HttpClient cliente =
            new HttpClient();

        Console.WriteLine(
            "Aguardando dados..."
        );

        Console.WriteLine();

        while(true)
        {
            try
            {
                if(!porta.IsOpen)
                {
                    Console.WriteLine(
                        "Porta fechada. Tentando reabrir..."
                    );

                    Thread.Sleep(500);

                    porta.Open();

                    Console.WriteLine(
                        "Porta reaberta com sucesso."
                    );
                }

                string mensagem =
                    porta.ReadLine();

                int inicioJson =
                    mensagem.IndexOf("{");

                if(inicioJson >= 0)
                {
                    string json =
                        mensagem.Substring(
                            inicioJson
                        ).Trim();

                    if(
                        json.StartsWith("{")
                        &&
                        json.EndsWith("}")
                    )
                    {
                        Console.WriteLine(
                            "Recebido: "
                            + json
                        );

                        StringContent conteudo =
                            new StringContent(
                                json,
                                Encoding.UTF8,
                                "application/json"
                            );

                        HttpResponseMessage resposta =
                            await cliente.PostAsync(
                                urlServidor,
                                conteudo
                            );

                        string retorno =
                            await resposta
                                .Content
                                .ReadAsStringAsync();

                        Console.WriteLine(
                            "Status: "
                            + resposta.StatusCode
                        );

                        Console.WriteLine(
                            "Servidor: "
                            + retorno
                        );

                        Console.WriteLine();
                    }
                }
            }
            catch(TimeoutException)
            {
                Console.WriteLine(
                    "Aguardando dados do STM32..."
                );
            }
            catch(IOException erro)
            {
                Console.WriteLine(
                    "Erro na Porta COM: "
                    + erro.Message
                );

                if(porta.IsOpen)
                {
                    porta.Close();
                }

                Thread.Sleep(500);
            }
            catch(HttpRequestException erro)
            {
                Console.WriteLine(
                    "Erro ao acessar o servidor: "
                    + erro.Message
                );
            }
            catch(Exception erro)
            {
                Console.WriteLine(
                    "Erro: "
                    + erro.Message
                );
            }
        }
    }

    static string EncontrarSTM32()
    {
        string[] portas =
            SerialPort.GetPortNames();

        byte[] assinatura =
        {
            0xAA,
            0x55,
            0x01,
            0xFF
        };

        Console.WriteLine(
            "Procurando STM32..."
        );

        foreach(string nome in portas)
        {
            Console.WriteLine(
                "Testando "
                + nome
            );

            SerialPort porta =
                new SerialPort(
                    nome,
                    115200
                );

            porta.ReadTimeout =
                1500;

            try
            {
                porta.Open();

                Thread.Sleep(
                    1200
                );

                byte[] buffer =
                    new byte[512];

                int quantidade =
                    porta.Read(
                        buffer,
                        0,
                        buffer.Length
                    );

                porta.Close();

                for(
                    int i = 0;
                    i <= quantidade - 4;
                    i++
                )
                {
                    if(
                        buffer[i]
                        ==
                        assinatura[0]
                        &&
                        buffer[i + 1]
                        ==
                        assinatura[1]
                        &&
                        buffer[i + 2]
                        ==
                        assinatura[2]
                        &&
                        buffer[i + 3]
                        ==
                        assinatura[3]
                    )
                    {
                        return nome;
                    }
                }
            }
            catch
            {
                if(porta.IsOpen)
                {
                    porta.Close();
                }
            }
        }

        return null;
    }
}