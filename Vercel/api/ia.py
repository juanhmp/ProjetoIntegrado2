import os
import csv
import json

from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from sklearn.neighbors import KNeighborsClassifier


DATASET_PATH = os.path.join(
    os.path.dirname(__file__),
    "dataset.csv"
)

N_NEIGHBORS = 5


def load_dataset(path):
    X = []
    y = []

    with open(
        path,
        newline="",
        encoding="utf-8"
    ) as arquivo:

        reader = csv.reader(arquivo)

        next(reader)

        for row in reader:
            *features, label = row

            X.append(
                [float(valor) for valor in features]
            )

            y.append(label)

    return X, y


X, y = load_dataset(
    DATASET_PATH
)

modelo = KNeighborsClassifier(
    n_neighbors=N_NEIGHBORS
)

modelo.fit(
    X,
    y
)


class handler(BaseHTTPRequestHandler):

    def do_GET(self):

        parametros = parse_qs(
            urlparse(
                self.path
            ).query
        )

        if "bpm" not in parametros:

            self.enviar_resposta(
                {
                    "error":
                        "BPM não informado"
                },
                400
            )

            return

        try:

            bpm = float(
                parametros["bpm"][0]
            )

        except ValueError:

            self.enviar_resposta(
                {
                    "error":
                        "BPM inválido"
                },
                400
            )

            return


        sample = [
            bpm
        ]


        if len(sample) != len(X[0]):

            self.enviar_resposta(
                {
                    "error":
                        "Quantidade de características inválida"
                },
                400
            )

            return


        prediction = modelo.predict(
            [sample]
        )[0]


        proba = modelo.predict_proba(
            [sample]
        )[0]


        probabilities = {

            label: float(probabilidade)

            for label, probabilidade
            in zip(
                modelo.classes_,
                proba
            )
        }


        resposta = {
            "bpm":
                bpm,

            "classification":
                prediction,

            "probabilities":
                probabilities
        }


        self.enviar_resposta(
            resposta,
            200
        )


    def enviar_resposta(
        self,
        dados,
        status
    ):

        conteudo = json.dumps(
            dados
        ).encode(
            "utf-8"
        )

        self.send_response(
            status
        )

        self.send_header(
            "Content-Type",
            "application/json"
        )

        self.send_header(
            "Content-Length",
            str(
                len(conteudo)
            )
        )

        self.end_headers()

        self.wfile.write(
            conteudo
        )