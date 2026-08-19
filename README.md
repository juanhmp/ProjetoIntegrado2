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
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
</p>

---

## 🎥 Demonstração

Vídeo apresentando o projeto completo, incluindo os códigos desenvolvidos, circuito, STM32, comunicação pela Porta COM, aplicação C#, Inteligência Artificial e interface Web funcionando em conjunto.

> ▶️ **Vídeo do projeto:**  
> [Assistir no YouTube](COLOQUE_O_LINK_DO_VIDEO_AQUI)

---

## 🎯 Objetivo

Desenvolver um sistema distribuído capaz de coletar uma variável analógica através de um STM32, transmitir os dados para um computador, processar as informações e utilizar Inteligência Artificial para classificar as medições.

O sistema também apresenta os resultados em uma interface Web, permitindo acompanhar as medições em tempo real.

O projeto pode funcionar tanto em **ambiente local** quanto através da versão **online publicada na Vercel**.

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

A aplicação C# permite escolher entre o servidor local e o servidor online:

```text
                    ┌──→ Servidor Local → IA Local → Site Local
STM32 → Porta COM → C#
                    └──→ Vercel → IA Online → Site Online
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

- Detectar automaticamente a Porta COM utilizada pelo STM32;
- Receber continuamente os dados;
- Identificar e separar os dados recebidos;
- Trabalhar com as informações em formato JSON;
- Enviar as medições ao servidor através de HTTP;
- Permitir a utilização do servidor local ou da versão online.

Para facilitar a identificação automática do dispositivo, foi utilizado um **protocolo com assinatura hexadecimal**.

A assinatura utilizada permite que o programa procure entre as portas disponíveis e identifique qual delas corresponde ao STM32, evitando a necessidade de configurar manualmente uma COM específica.

A mesma aplicação C# é utilizada nos dois modos de funcionamento.

---

### 3. Servidor Web / API REST

O projeto possui uma versão local do servidor desenvolvida utilizando **JavaScript com Node.js e Express** e uma versão online utilizando funções disponibilizadas através da **Vercel**.

O servidor é responsável por:

- Receber as medições enviadas pelo C#;
- Validar os dados recebidos;
- Encaminhar os dados para o módulo de Inteligência Artificial;
- Armazenar a última medição;
- Calcular a tendência das últimas leituras;
- Disponibilizar os dados para a interface Web.

A comunicação é realizada utilizando **HTTP e JSON**.

Na versão local, entre as rotas utilizadas estão:

```text
POST /medicao
GET  /dados
GET  /status
```

Na versão online, são utilizadas:

```text
POST /api/medicao
GET  /api/dados
GET  /api/status
POST /api/ia
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

O KNN compara uma nova medição com os exemplos presentes no dataset e utiliza os vizinhos mais próximos para determinar a classificação.

A implementação utiliza a biblioteca **scikit-learn** em Python.

A IA também pode retornar as probabilidades associadas às classes analisadas.

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

A interface também possui uma versão publicada online através da Vercel.

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
      HTTP
       ↓
Servidor / API REST
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

## 🌐 Modos de funcionamento

O projeto pode funcionar de duas formas.

### Local

No modo local, todos os módulos de processamento são executados no próprio computador.

```text
STM32
  ↓
C#
  ↓
Servidor Node.js
  ↓
IA Python
  ↓
Site Local
```

### Online

No modo online, o C# continua responsável pela comunicação com o STM32, porém envia as medições através da Internet para a aplicação publicada na Vercel.

```text
STM32
  ↓
C#
  ↓
Internet
  ↓
Vercel
  ↓
API
  ↓
IA
  ↓
Site Online
```

A escolha entre os dois modos é realizada na aplicação C#.

---

## ▶️ Como usar

### Modo Local

#### 1. STM32

Conecte o STM32 ao computador através da USB utilizada para comunicação CDC.

Compile e grave o firmware na placa.

O dispositivo deverá ser reconhecido pelo Windows como uma Porta COM.

#### 2. Instalar as dependências do servidor

Na pasta local do projeto, execute:

```bash
npm install
```

Caso necessário:

```bash
npm install express
```

#### 3. Preparar a Inteligência Artificial

O computador deve possuir Python e as bibliotecas necessárias.

Instale o scikit-learn:

```bash
pip install scikit-learn
```

#### 4. Iniciar o servidor

Execute:

```bash
node app.js
```

O servidor será iniciado em:

```text
http://localhost:3000
```

#### 5. Executar a aplicação C#

Configure a aplicação C# para utilizar o modo local e execute:

```bash
dotnet run
```

O programa procura automaticamente a Porta COM correspondente ao STM32 e começa a receber as medições.

#### 6. Abrir a interface

No navegador, acesse:

```text
http://localhost:3000
```

A interface começará a apresentar os dados recebidos.

---

### Modo Online

#### 1. STM32

Conecte o STM32 ao computador e execute normalmente o firmware.

#### 2. Aplicação C#

Configure a aplicação C# para utilizar a versão online e execute:

```bash
dotnet run
```

A aplicação identifica automaticamente a Porta COM e envia as medições para a API publicada na Vercel.

#### 3. Interface Web

Abra a interface publicada na Vercel.

Não é necessário executar o servidor Node.js local para utilizar o modo online.

---

## 💡 Decisões tomadas

### Identificação automática da Porta COM

Para evitar a necessidade de definir manualmente uma Porta COM específica, foi implementado um protocolo de identificação utilizando uma assinatura hexadecimal.

A assinatura utilizada é:

`AA 55 01 FF`

A aplicação em C# verifica as portas disponíveis e identifica automaticamente aquela que está recebendo a assinatura enviada pelo STM32.

Isso permite que o sistema continue funcionando mesmo que o Windows altere o número da porta, por exemplo, de COM7 para COM8.

### JSON

O formato **JSON** foi utilizado para estruturar os dados transmitidos entre os diferentes módulos do sistema.

Por exemplo:

```json
{
    "adc": 528,
    "bpm": 58,
    "filtro": "sem"
}
```

Isso permite organizar as informações transmitidas entre o STM32, a aplicação C#, o servidor e a interface Web.

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

### Funcionamento local e online

O projeto foi estruturado para permitir dois modos de funcionamento.

O modo local pode ser utilizado durante o desenvolvimento e testes, enquanto a versão online utiliza a aplicação publicada na Vercel.

A mesma aplicação C# pode ser utilizada nos dois modos.

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
├── STM/
│
├── CS/
│
├── Local/
│   ├── IA/
│   │   ├── ia.py
│   │   └── dataset.csv
│   │
│   └── Site/
│       ├── index.html
│       └── app.js
│
├── Vercel/
│   ├── api/
│   │   ├── ia.py
│   │   ├── dataset.csv
│   │   ├── medicao.js
│   │   ├── dados.js
│   │   └── status.js
│   │
│   ├── public/
│   │   └── index.html
│   │
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

- **STM** — firmware responsável pela aquisição e envio dos dados;
- **CS** — aplicação responsável pela comunicação serial e envio das medições;
- **Local** — arquivos utilizados para executar o servidor, IA e interface localmente;
- **Vercel** — arquivos utilizados para executar a versão online.

---

## 👨‍💻 Autores

**Juan Henrique de Mendonça Pereira**  
**Yan Martins Menegueli**

---

## 🎓 Projeto Acadêmico

Projeto Integrado da **34-DS**, envolvendo as disciplinas:

- SEB — Sistemas Embarcados
- DAPL — Desenvolvimento de Aplicativos
- CGR — Computação Gráfica (Inteligência Artificial)
- LPR — Linguagens de Programação

O projeto demonstra a integração entre **hardware, comunicação serial, aplicação intermediária, servidor Web, Inteligência Artificial e interface Web**, formando uma solução distribuída semelhante às utilizadas em sistemas de Internet das Coisas (IoT).
