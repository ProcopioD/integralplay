# 🏐 Aluguel de Quadras - Backend

Este repositório contém o backend do sistema **Aluguel de Quadras**, um projeto acadêmico que permite aos usuários realizarem reservas de quadras esportivas, com funcionalidades como cadastro, consulta, avaliações e controle de pagamentos.

Este backend foi desenvolvido em **Node.js** com **Express**, utilizando banco de dados **MySQL**, **MongoDB** e variáveis de ambiente com `.env`.

---

## 📦 Funcionalidades principais da API

- 📋 Cadastro e consulta de usuários
- 🏟️ Consulta e filtro de quadras disponíveis
- 📅 Criação, atualização e cancelamento de reservas
- 💬 Avaliações e comentários
- 💳 Pagamento de reservas
- 🕓 Histórico de reservas

## 🔗 API Centralizadora

Como parte do desafio do projeto, desenvolvemos também uma API centralizadora. Ela tem como função organizar e concentrar todas as funcionalidades principais do sistema em um único ponto de entrada para o frontend. Isso inclui as operações de cadastro, autenticação, consulta de quadras, gerenciamento de reservas, pagamentos e avaliações.

Com essa abordagem, garantimos uma estrutura mais organizada e escalável, além de facilitar a manutenção futura. A API centralizadora também padroniza o acesso às rotas, ajudando a separar melhor as responsabilidades dentro do código e mantendo o backend mais limpo e coeso.

Toda a comunicação entre o frontend e o backend é feita por meio dessa camada centralizada, garantindo consistência e segurança no acesso aos dados.

---

## Como subir a aplicação (passo a passo)

O backend do nosso projeto "Aluguel de Quadras" foi desenvolvido em Node.js, com banco de dados MySQL. Abaixo explicamos como executar a aplicação localmente e como realizamos os testes.

Clonando o repositório:
Para começar, clonamos o repositório do backend do nosso grupo a partir do GitHub. Utilizamos o seguinte link:
https://github.com/shamantk/aluguel_de_quadras
Após o clone, acessamos a pasta do projeto com o comando cd aluguel_de_quadras no terminal.

Instalação das dependências:
Dentro da pasta do projeto, rodamos o comando npm install para instalar todas as dependências necessárias, como Express, MySQL, JWT, Bcrypt, dotenv e outras utilizadas ao longo do backend.

Configuração do banco de dados:
Criamos o banco de dados no MySQL Workbench com o nome aluguel_quadras. Após isso, executamos os scripts SQL responsáveis pela criação das tabelas, relacionamentos e constraints. Garantimos que o banco estivesse funcionando corretamente antes de iniciar a aplicação.

Criação do arquivo .env:
Criamos um arquivo .env na raiz do projeto contendo as variáveis de ambiente com os dados de conexão do banco de dados e outras configurações importantes. O conteúdo do nosso .env ficou assim (com os dados adaptados à nossa máquina local):

ini
Copiar
Editar
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=123456
DB_NAME=aluguel_quadras
JWT_SECRET=chave_secreta_do_grupo
Execução da aplicação:
Com tudo configurado, executamos a aplicação com o comando npm run dev. A aplicação iniciou corretamente na porta 3000, e ficou acessível em https://integralplay-production.up.railway.app

Testes das rotas:
Para testar a API desenvolvida, utilizamos o Insomnia, que nos permitiu simular requisições HTTP e validar o comportamento das rotas. Durante os testes, criamos usuários, fizemos login, reservas, pagamentos e também verificamos o retorno dos históricos de reserva e avaliações.

Abaixo estão as principais rotas que implementamos e testamos:

POST /usuarios – cadastro de usuários

GET /usuarios – consulta de usuários

POST /login – autenticação com retorno de token JWT

GET /quadras – consulta de quadras

GET /quadras/filtro – filtro de quadras por tipo ou localização

POST /reserva – criação de reserva

PUT /reserva/:id – atualização de reserva

DELETE /reserva/:id – cancelamento de reserva

GET /reserva/:idUsuario – consulta de reservas do usuário

GET /reserva/historico/:idUsuario – histórico de reservas

POST /avaliacao – envio de avaliação

POST /pagamento – pagamento de reserva

Com esse processo, conseguimos rodar e testar toda a aplicação backend localmente de forma estável, garantindo que todas as rotas estivessem funcionando corretamente.
