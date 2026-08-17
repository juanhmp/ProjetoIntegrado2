# 📊 Projeto Integrado 2

Projeto desenvolvido para integrar as disciplinas de **Sistemas Embarcados (SEB)**, **Desenvolvimento de Aplicativos (DAPL)**, **Inteligência Artificial (IA)** e **Linguagens de Programação (LPR)**.

O sistema realiza a aquisição, transmissão, processamento, classificação e visualização de dados, simulando um sistema de **monitoramento cardíaco**.

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

---

### 2. Instalar as dependências do servidor

Na pasta do projeto, execute:

```bash
npm install
```

Caso necessário:

```bash
npm install express
```

---

### 3. Preparar a Inteligência Artificial

O computador deve possuir Python e as bibliotecas necessárias.

Instale o scikit-learn:

```bash
pip install scikit-learn
```

Verifique também se o caminho do executável Python configurado no servidor corresponde ao computador utilizado.

---

### 4. Iniciar o servidor

Execute:

```bash
node app.js
```

O servidor será iniciado em:

```text
http://localhost:3000
```

---

### 5. Executar a aplicação C#

Execute a aplicação responsável pela comunicação serial.

Por exemplo:

```bash
dotnet run
```

O programa procura a Porta COM correspondente ao STM32 e começa a receber as medições.

As informações são então enviadas automaticamente ao servidor.

---

### 6. Abrir a interface

No navegador, acesse:

```text
http://localhost:3000
```

A interface começará a apresentar os dados recebidos.

---

## 💡 Decisões tomadas

### USB CDC

Foi escolhido **USB CDC** para permitir que o STM32 seja reconhecido pelo computador como uma Porta COM, facilitando a comunicação com a aplicação em C#.

### JSON

O formato **JSON** foi escolhido para organizar as informações transmitidas entre os diferentes módulos do sistema.

Exemplo:

```json
{
    "adc": 528,
    "bpm": 58,
    "filtro": "sem"
}
```

### HTTP e API REST

A comunicação entre a aplicação C# e o servidor utiliza **HTTP**, permitindo separar a aquisição dos dados da aplicação Web.

### Identificação automática da Porta COM

Foi implementada uma assinatura em **hexadecimal** para permitir que a aplicação C# identifique automaticamente a porta correspondente ao STM32.

Isso evita depender de uma porta fixa, como COM7 ou COM8, já que o número atribuído pelo Windows pode mudar.

### KNN

O algoritmo **K-Nearest Neighbors** foi escolhido para realizar a classificação das medições em três categorias.

O modelo é simples de implementar e permite demonstrar a utilização de Machine Learning no processamento dos dados do projeto.

### Últimas 5 leituras

Para detectar a tendência, o sistema mantém as últimas cinco medições de BPM.

Essa análise foi mantida separada do KNN, pois possui uma finalidade diferente: identificar a evolução recente do valor, enquanto a IA classifica a medição atual.

### Interface em tempo real

A interface consulta periodicamente o servidor para atualizar os dados apresentados ao usuário.

Também foram implementados alertas visuais para facilitar a identificação de medições classificadas como críticas.

---

## 🛠️ Tecnologias utilizadas

- STM32
- ADC
- GPIO
- USB CDC
- Porta COM
- C
- C#
- JavaScript
- Node.js
- Express
- Python
- scikit-learn
- KNN
- HTML
- CSS
- JSON
- HTTP
- API REST

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
