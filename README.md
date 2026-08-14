📊 Projeto Integrado 2

Projeto desenvolvido para integrar as disciplinas de Sistemas Embarcados (SEB), Desenvolvimento de Aplicativos (DAPL), Inteligência Artificial (IA) e Linguagens de Programação (LPR).

🎯 Objetivo

Desenvolver um sistema completo de aquisição, processamento e visualização de dados, simulando o monitoramento de uma variável física.

O sistema utiliza um STM32 para aquisição dos dados, uma aplicação intermediária para comunicação com um servidor Web, um algoritmo de Inteligência Artificial para classificação das medições e uma interface Web para visualização dos resultados.

⚙️ Funcionamento

O projeto é dividido nos seguintes módulos:

STM32
  ↓
Aplicação C#
  ↓
Servidor Web / API REST
  ↓
Inteligência Artificial
  ↓
Interface Web

1. Aquisição de dados

O STM32 realiza a leitura de um sensor analógico, simulado por um trimpot ou potenciômetro, e envia periodicamente as medições ao computador utilizando USB CDC / Porta COM.

O sistema também possui a opção de ativar um pré-processamento ou filtragem através de uma entrada GPIO.

2. Comunicação

Uma aplicação desenvolvida em C# é responsável por:

* Estabelecer comunicação com a Porta COM;
* Receber continuamente as leituras do STM32;
* Organizar e tratar as informações;
* Converter os dados para JSON;
* Enviar as medições para o servidor através de requisições HTTP.

3. Servidor Web

O servidor disponibiliza uma API REST responsável por receber as medições, encaminhá-las para o módulo de Inteligência Artificial e disponibilizar os resultados para o sistema.

A comunicação utiliza HTTP e JSON.

4. Inteligência Artificial

O sistema utiliza um modelo de Machine Learning para realizar automaticamente a classificação de cada nova leitura recebida.

A classificação deve possuir pelo menos três categorias.

5. Interface Web

A interface Web apresenta:

* Leitura atual;
* Classificação;
* Histórico das últimas medições;
* Horário da última atualização;
* Indicação visual do estado atual do sistema.

🔄 Fluxo do Sistema

Sensor Analógico
      ↓
     STM32
      ↓
USB CDC / Porta COM
      ↓
Aplicação C#
      ↓
     JSON
      ↓
   API REST
      ↓
Inteligência Artificial
      ↓
 Classificação
      ↓
 Interface Web

🛠️ Tecnologias

* STM32
* Sensor analógico
* USB CDC / Porta COM
* C#
* JSON
* HTTP
* API REST
* Machine Learning
* Interface Web

👨‍💻 Autores

Juan Henrique de Mendonça Pereira
Yan Martins Menegueli

🎓 Projeto Acadêmico

Projeto Integrado da 34-DS, envolvendo as disciplinas SEB, DAPL, IA e LPR.

O objetivo é desenvolver uma solução distribuída semelhante às aplicações de Internet das Coisas (IoT), envolvendo aquisição de dados, comunicação entre sistemas, processamento e tomada de decisão.
