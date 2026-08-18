<h1 align="center">📊 Projeto Integrado 2</h1>

<p align="center">
  Sistema integrado para aquisição, processamento, classificação e visualização de dados utilizando STM32, C#, Inteligência Artificial e interface Web.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/STM32-03234B?style=for-the-badge&logo=stmicroelectronics&logoColor=white" alt="STM32">
  <img src="https://img.shields.io/badge/C%23-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="C#">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="scikit-learn">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

---

## 🎯 Objetivo

Desenvolver um sistema distribuído capaz de coletar uma variável analógica através de um STM32, transmitir os dados para um computador, processar as informações e utilizar Inteligência Artificial para classificar as medições.

O sistema também apresenta os resultados em uma interface Web, permitindo acompanhar as medições em tempo real.

---

## ⚙️ Funcionamento

O projeto é dividido em cinco partes principais:

```text
STM32
  ↓
USB CDC / Porta COM
  ↓
Aplicação C#
  ↓
Servidor Web / API REST
  ↓
Inteligência Artificial
  ↓
Interface Web
```

### 1. STM32

O STM32 realiza a leitura de uma entrada analógica utilizando o **ADC**.

O valor é utilizado para gerar a medição de BPM utilizada pelo sistema.

Os dados são enviados para o computador através de **USB CDC**, fazendo com que o STM32 seja reconhecido como uma Porta COM.

Os dados enviados possuem informações como:

```json
{
    "adc": 528,
    "bpm": 58,
    "filtro": "sem"
}
```

O sistema também permite ativar ou desativar um filtro através de uma entrada GPIO.

---

### 2. Aplicação C#

A aplicação em C# realiza a comunicação entre o STM32 e o servidor.

Suas principais funções são:

- Detectar a Porta COM utilizada pelo STM32;
- Receber continuamente os dados;
- Identificar e separar os dados recebidos;
- Trabalhar com as informações em formato JSON;
- Enviar as medições ao servidor através de HTTP.

Para facilitar a identificação automática do dispositivo, foi utilizado um **protocolo com assinatura hexadecimal**.

A assinatura utilizada permite que o programa procure entre as portas disponíveis e identifique qual delas corresponde ao STM32, evitando a necessidade de configurar manualmente uma COM específica.

---

### 3. Servidor Web / API REST

O servidor foi desenvolvido utilizando **JavaScript com Node.js e Express**.

Ele é responsável por:

- Receber as medições enviadas pelo C#;
- Validar os dados recebidos;
- Executar o módulo de Inteligência Artificial;
- Armazenar a última medição;
- Calcular a tendência das últimas leituras;
- Disponibilizar os dados para a interface Web.

A comunicação é realizada utilizando **HTTP e JSON**.

Entre as rotas utilizadas estão:

```text
POST /medicao
GET  /dados
GET  /status
```

---

## 🧠 Inteligência Artificial

A classificação das medições é realizada utilizando o algoritmo **K-Nearest Neighbors (KNN)**.

O modelo recebe o BPM e realiza a classificação em três categorias:

```text
Baixo
Medio
Alto
```

O KNN compara uma nova medição com os exemplos utilizados no treinamento e utiliza os vizinhos mais próximos para determinar a classificação.

A implementação utiliza a biblioteca **scikit-learn** em Python.

---

## 📈 Detecção de Tendência

Além da classificação realizada pela Inteligência Artificial, o sistema analisa as **últimas 5 leituras de BPM**.

Com isso, é possível identificar a tendência atual das medições:

```text
↑ Crescendo
↓ Diminuindo
→ Estável
```

A tendência é calculada separadamente da Inteligência Artificial.

Enquanto o KNN é responsável pela **classificação da medição**, o servidor utiliza o histórico recente para determinar se os valores estão aumentando, diminuindo ou permanecendo estáveis.

---

## 🖥️ Interface Web

A interface apresenta as informações recebidas pelo sistema em tempo real.

São exibidos:

- Valor bruto do ADC;
- BPM atual;
- Classificação da IA;
- Estado do filtro;
- Tendência das últimas leituras;
- Horário da última atualização;
- Estado da conexão;
- Histórico das últimas medições;
- Gráfico da evolução do BPM;
- Alertas visuais para estados críticos.

Quando uma medição é classificada como **Alto**, a interface apresenta uma indicação visual de alerta.

---

## 🔄 Fluxo completo

```text
Entrada analógica
       ↓
      ADC
       ↓
     STM32
       ↓
USB CDC / Porta COM
       ↓
Aplicação C#
       ↓
      JSON
       ↓
   HTTP POST
       ↓
API REST / Node.js
       ↓
       ├──────────────→ Análise das últimas leituras
       │                       ↓
       │                    Tendência
       │
       ↓
 Inteligência Artificial
       ↓
      KNN
       ↓
 Classificação
       ↓
 Interface Web
```

---

## ▶️ Como usar

### 1. STM32

Conecte o STM32 ao computador através da USB utilizada para comunicação CDC.

Compile e grave o firmware na placa.

O dispositivo deverá ser reconhecido pelo Windows como uma Porta COM.

### 2. Instalar as dependências do servidor

Na pasta do projeto, execute:

```bash
npm install
```

Caso necessário:

```bash
npm install express
```

### 3. Preparar a Inteligência Artificial

O computador deve possuir Python e as bibliotecas necessárias.

Instale o scikit-learn:

```bash
pip install scikit-learn
```

Verifique também se o caminho do executável Python configurado no servidor corresponde ao computador utilizado.

### 4. Iniciar o servidor

Execute:

```bash
node app.js
```

O servidor será iniciado em:

```text
http://localhost:3000
```

### 5. Executar a aplicação C#

Execute a aplicação responsável pela comunicação serial.

Por exemplo:

```bash
dotnet run
```

O programa procura a Porta COM correspondente ao STM32 e começa a receber as medições.

As informações são então enviadas automaticamente ao servidor.

### 6. Abrir a interface

No navegador, acesse:

```text
http://localhost:3000
```

A interface começará a apresentar os dados recebidos.

---

## 💡 Decisões tomadas

### Identificação automática da Porta COM

Para evitar a necessidade de definir manualmente uma Porta COM específica, foi implementado um protocolo de identificação utilizando uma assinatura hexadecimal.

A assinatura utilizada é:

`AA 55 01 FF`

A aplicação em C# verifica as portas disponíveis e identifica automaticamente aquela que está recebendo a assinatura enviada pelo STM32.

Isso permite que o sistema continue funcionando mesmo que o Windows altere o número da porta, por exemplo, de COM7 para COM8.

### KNN

Para realizar a classificação das medições, foi escolhido o algoritmo K-Nearest Neighbors (KNN).

O modelo utiliza o valor de BPM recebido e realiza a classificação em três categorias:

- Baixo
- Medio
- Alto

Foi utilizado o KNN para aplicar os conceitos de classificação estudados na disciplina de Inteligência Artificial.

### Tendência das últimas leituras

Para identificar se o BPM está aumentando ou diminuindo, foi decidido analisar as últimas 5 leituras recebidas pelo sistema.

A tendência pode ser apresentada como:

- ↑ Crescendo
- ↓ Diminuindo
- → Estável

Essa análise funciona separadamente da classificação realizada pela Inteligência Artificial.

### Interface Web

Na interface foram adicionados recursos para facilitar a visualização e o acompanhamento das medições, como:

- Gráfico de evolução do BPM;
- Histórico das últimas medições;
- Indicação da tendência;
- Estado da conexão;
- Alertas visuais para classificações críticas.

---

## 📁 Estrutura geral

```text
ProjetoIntegrado2/
│
├── STM32/
│   └── Firmware
│
├── CS/
│   └── Aplicação C#
│
├── IA/
│   └── ia.py
│
└── Site/
    ├── index.html
    └── app.js
```

---

## 👨‍💻 Autores

**Juan Henrique de Mendonça Pereira**  
**Yan Martins Menegueli**

---

## 🎓 Projeto Acadêmico

Projeto Integrado da **34-DS**, envolvendo as disciplinas:

- SEB — Sistemas Embarcados
- DAPL — Desenvolvimento de Aplicativos
- IA — Inteligência Artificial
- LPR — Linguagens de Programação

O projeto demonstra a integração entre **hardware, comunicação serial, aplicação intermediária, servidor Web, Inteligência Artificial e interface Web**, formando uma solução distribuída semelhante às utilizadas em sistemas de Internet das Coisas (IoT).
