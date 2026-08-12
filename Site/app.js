const caminhoPython = "C:\\Users\\Alunos\\AppData\\Local\\Programs\\Python\\Python314\\python.exe";
const express = require("express");
const { execFile } = require("child_process");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(__dirname));

let ultimoDado = {
    bpm: null,
    filtro: null,
    resultado: null,
    horario: null
};

let ultimaMedicao = null;

app.post("/medicao", (req, res) => {

    const bpm = req.body.bpm;
    const filtro = req.body.filtro;

    if(bpm == undefined || filtro == undefined)
    {
        return res.status(400).json({
            status: 400,
            mensagem: "BPM e filtro são obrigatórios"
        });
    }

    const caminhoIA = path.join(
    __dirname,
    "..",
    "IA",
    "ia.py"
);

    execFile(
        caminhoPython,
        [caminhoIA, bpm],
        (erro, stdout) => {

            if(erro)
{
    console.log("ERRO:");
    console.log(erro);

    console.log("STDERR:");
    console.log(erro.stderr);

    console.log("CAMINHO IA:");
    console.log(caminhoIA);

    return res.status(500).json({
        status: 500,
        mensagem: "Erro ao executar a IA"
    });
}

            const resultado = stdout.trim();

            const agora = new Date();

            ultimoDado = {
                bpm: bpm,
                filtro: filtro,
                resultado: resultado,
                horario: agora.toLocaleTimeString("pt-BR")
            };

            ultimaMedicao = Date.now();

            res.status(200).json({
                status: 200,
                mensagem: "Medição processada com sucesso",
                dados: ultimoDado
            });

        }
    );

});

app.get("/dados", (req, res) => {

    if(ultimoDado.bpm == null)
    {
        return res.status(404).json({
            status: 404,
            mensagem: "Nenhuma medição recebida"
        });
    }

    res.status(200).json({
        status: 200,
        mensagem: "Dados encontrados",
        dados: ultimoDado
    });

});

app.get("/status", (req, res) => {

    if(ultimaMedicao == null)
    {
        return res.status(503).json({
            status: 503,
            sistema: "offline"
        });
    }

    const tempo = Date.now() - ultimaMedicao;

    if(tempo > 5000)
    {
        return res.status(503).json({
            status: 503,
            sistema: "offline"
        });
    }

    res.status(200).json({
        status: 200,
        sistema: "online"
    });

});

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});

app.use((req, res) => {

    res.status(404).json({
        status: 404,
        mensagem: "Rota não encontrada"
    });

});

app.listen(3000, () => {

    console.log(
        "Servidor rodando em http://localhost:3000"
    );

});