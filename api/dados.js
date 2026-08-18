import { getCache } from "@vercel/functions";

export default
{
    async fetch()
    {
        const cache =
            getCache();

        const dadoSalvo =
            await cache.get(
                "ultimoDado"
            );

        if(!dadoSalvo)
        {
            return Response.json(
                {
                    status: 404,
                    mensagem:
                        "Nenhuma medição recebida"
                },
                {
                    status: 404
                }
            );
        }

        const ultimoDado =
            JSON.parse(
                dadoSalvo
            );

        return Response.json(
            {
                status: 200,
                mensagem:
                    "Dados encontrados",
                dados:
                    ultimoDado
            },
            {
                status: 200
            }
        );
    }
};