import sys
import os
import csv
import json

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
    ) as f:

        reader = csv.reader(f)

        next(reader)

        for row in reader:

            *features, label = row

            X.append(
                [float(v) for v in features]
            )

            y.append(label)

    return X, y


def main():

    if len(sys.argv) < 2:

        print(
            json.dumps({
                "error": "missing BPM argument"
            })
        )

        return


    try:

        bpm = float(sys.argv[1])

    except ValueError:

        print(
            json.dumps({
                "error": "BPM must be a number"
            })
        )

        return


    X, y = load_dataset(
        DATASET_PATH
    )


    if len(X) == 0:

        print(
            json.dumps({
                "error": "dataset is empty"
            })
        )

        return


    sample = [
        bpm
    ]


    if len(sample) != len(X[0]):

        print(
            json.dumps({
                "error":
                f"sample must have {len(X[0])} features, got {len(sample)}"
            })
        )

        return


    knn = KNeighborsClassifier(
        n_neighbors=N_NEIGHBORS
    )


    knn.fit(
        X,
        y
    )


    prediction = knn.predict(
        [sample]
    )[0]


    proba = knn.predict_proba(
        [sample]
    )[0]


    probabilities = {

        label: float(p)

        for label, p in zip(
            knn.classes_,
            proba
        )
    }


    print(
        json.dumps({
            "bpm": bpm,
            "classification": prediction,
            "probabilities": probabilities
        })
    )


if __name__ == "__main__":
    main()