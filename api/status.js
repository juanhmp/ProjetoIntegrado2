import { getCache } from "@vercel/functions";

export default
{
    async fetch()
    {
        const cache =
            getCache();

        const ultimaMedicao =
            await cache.get(
                "ultimaMedicao"
            );

        if(!ultimaMedicao)
        {
            return Response.json(
                {
                    status: 503,
                    sistema: "offline"
                },
                {
                    status: 503
                }
            );
        }

        const tempo =
            Date.now()
            -
            Number(
                ultimaMedicao
            );

        if(tempo > 5000)
        {
            return Response.json(
                {
                    status: 503,
                    sistema: "offline"
                },
                {
                    status: 503
                }
            );
        }

        return Response.json(
            {
                status: 200,
                sistema: "online"
            },
            {
                status: 200
            }
        );
    }
};