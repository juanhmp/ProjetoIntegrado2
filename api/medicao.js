import { getCache } from "@vercel/functions";

function calcularTendencia(leituras)
{
    if(leituras.length < 2)
    {
        return "Aguardando";
    }

    const primeira =
        leituras[0];

    const ultima =
        leituras[
            leituras.length - 1
        ];

    if(ultima > primeira)
    {
        return "Crescendo";
    }

    if(ultima < primeira)
    {
        return "Diminuindo";
    }

    return "Estavel";
}

export default
{
    async fetch(request)
    {
        if(request.method != "POST")
        {
            return Response.json(
                {
                    status: 405,
                    mensagem: "Método não permitido"
                },
                {
                    status: 405
                }
            );
        }

        let body;

        try
        {
            body =
                await request.json();
        }
        catch
        {
            return Response.json(
                {
                    status: 400,
                    mensagem: "JSON inválido"
                },
                {
                    status: 400
                }
            );
        }

        const adc =
            body.adc;

        const bpm =
            body.bpm;

        const filtro =
            body.filtro;

        if(
            adc == undefined
            ||
            bpm == undefined
            ||
            filtro == undefined
        )
        {
            return Response.json(
                {
                    status: 400,
                    mensagem:
                        "ADC, BPM e filtro são obrigatórios"
                },
                {
                    status: 400
                }
            );
        }

        const cache =
            getCache();

        const leiturasSalvas =
            await cache.get(
                "ultimasLeituras"
            );

        let ultimasLeituras = [];

        if(leiturasSalvas)
        {
            ultimasLeituras =
                JSON.parse(
                    leiturasSalvas
                );
        }

        ultimasLeituras.push(
            Number(bpm)
        );

        if(ultimasLeituras.length > 5)
        {
            ultimasLeituras.shift();
        }

        const tendencia =
            calcularTendencia(
                ultimasLeituras
            );

        const origem =
            new URL(
                request.url
            ).origin;

        const respostaIA =
            await fetch(
                origem +
                "/api/ia?bpm=" +
                encodeURIComponent(bpm)
            );

        if(!respostaIA.ok)
        {
            return Response.json(
                {
                    status: 500,
                    mensagem:
                        "Erro ao executar a IA"
                },
                {
                    status: 500
                }
            );
        }

        const respostaIAJson =
            await respostaIA.json();

        if(respostaIAJson.error)
        {
            return Response.json(
                {
                    status: 500,
                    mensagem:
                        respostaIAJson.error
                },
                {
                    status: 500
                }
            );
        }

        const resultado =
            respostaIAJson.classification;

        const agora =
            new Date();

        const ultimoDado =
        {
            adc: adc,
            bpm: bpm,
            filtro: filtro,
            resultado: resultado,
            tendencia: tendencia,
            horario:
                agora.toLocaleTimeString(
                    "pt-BR",
                    {
                        timeZone:
                            "America/Sao_Paulo"
                    }
                )
        };

        await cache.set(
            "ultimasLeituras",
            JSON.stringify(
                ultimasLeituras
            )
        );

        await cache.set(
            "ultimoDado",
            JSON.stringify(
                ultimoDado
            )
        );

        await cache.set(
            "ultimaMedicao",
            String(
                Date.now()
            )
        );

        return Response.json(
            {
                status: 200,
                mensagem:
                    "Medição processada com sucesso",
                dados:
                    ultimoDado
            },
            {
                status: 200
            }
        );
    }
};