import sys

from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split

dados = [
    [40], [42], [45], [47], [50], [52], [55], [57],
    [60], [62], [65], [68], [70], [72], [75], [78],
    [80], [82], [85], [88], [90], [92], [95], [98],
    [100], [102], [105], [108],
    [110], [115], [120], [125], [130], [135], [140],
    [145], [150], [155], [160], [165], [170], [175], [180]
]

classes = [
    "Baixo", "Baixo", "Baixo", "Baixo",
    "Baixo", "Baixo", "Baixo", "Baixo",

    "Medio", "Medio", "Medio", "Medio",
    "Medio", "Medio", "Medio", "Medio",
    "Medio", "Medio", "Medio", "Medio",
    "Medio", "Medio", "Medio", "Medio",
    "Medio", "Medio", "Medio", "Medio",

    "Alto", "Alto", "Alto", "Alto",
    "Alto", "Alto", "Alto", "Alto",
    "Alto", "Alto", "Alto", "Alto",
    "Alto", "Alto", "Alto"
]

X_treino, X_teste, y_treino, y_teste = train_test_split(
    dados,
    classes,
    test_size=0.2,
    random_state=42
)

modelo = KNeighborsClassifier(n_neighbors=3)

modelo.fit(X_treino, y_treino)

if len(sys.argv) > 1:

    bpm = int(sys.argv[1])

    resultado = modelo.predict([[bpm]])[0]

    print(resultado)

else:

    print("Acuracia treino:", modelo.score(X_treino, y_treino) * 100)
    print("Acuracia teste:", modelo.score(X_teste, y_teste) * 100)