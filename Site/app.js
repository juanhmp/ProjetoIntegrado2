const express = require("express");
const { execFile } = require("child_process");
const path = require("path");

const app = express();

app.use(express.json());

app.use(
    express.static(
        __dirname
    )
);

let ultimoDado = {
    adc: null,
    bpm: null,
    filtro: null,
    resultado: null,
    horario: null
};

let ultimaMedicao = null;

app.post("/medicao", (req, res) => {

    const adc =
        req.body.adc;

    const bpm =
        req.body.bpm;

    const filtro =
        req.body.filtro;

    if(
        adc == undefined
        ||
        bpm == undefined
        ||
        filtro == undefined
    )
    {
        return res.status(400).json({
            status: 400,
            mensagem:
                "ADC, BPM e filtro são obrigatórios"
        });
    }

    const caminhoPython =
        "C:\\Users\\Alunos\\AppData\\Local\\Programs\\Python\\Python314\\python.exe";

    const caminhoIA =
        path.join(
            __dirname,
            "..",
            "IA",
            "ia.py"
        );

    execFile(
        caminhoPython,
        [
            caminhoIA,
            bpm
        ],
        (
            erro,
            stdout,
            stderr
        ) => {

            if(erro)
            {
                return res.status(500).json({
                    status: 500,
                    mensagem:
                        "Erro ao executar a IA",
                    erro:
                        erro.message,
                    stderr:
                        stderr
                });
            }

            const resultado =
                stdout.trim();

            const agora =
                new Date();

            ultimoDado = {
                adc: adc,
                bpm: bpm,
                filtro: filtro,
                resultado: resultado,
                horario:
                    agora.toLocaleTimeString(
                        "pt-BR"
                    )
            };

            ultimaMedicao =
                Date.now();

            res.status(200).json({
                status: 200,
                mensagem:
                    "Medição processada com sucesso",
                dados:
                    ultimoDado
            });
        }
    );

});

app.get("/dados", (req, res) => {

    if(
        ultimoDado.bpm
        ==
        null
    )
    {
        return res.status(404).json({
            status: 404,
            mensagem:
                "Nenhuma medição recebida"
        });
    }

    res.status(200).json({
        status: 200,
        mensagem:
            "Dados encontrados",
        dados:
            ultimoDado
    });

});

app.get("/status", (req, res) => {

    if(
        ultimaMedicao
        ==
        null
    )
    {
        return res.status(503).json({
            status: 503,
            sistema:
                "offline"
        });
    }

    const tempo =
        Date.now()
        -
        ultimaMedicao;

    if(
        tempo
        >
        5000
    )
    {
        return res.status(503).json({
            status: 503,
            sistema:
                "offline"
        });
    }

    res.status(200).json({
        status: 200,
        sistema:
            "online"
    });

});

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "index.html"
        )
    );

});

app.use((req, res) => {

    res.status(404).json({
        status: 404,
        mensagem:
            "Rota não encontrada"
    });

});

app.listen(
    3000,
    () => {

        console.log(
            "Servidor rodando em http://localhost:3000"
        );

    }
);