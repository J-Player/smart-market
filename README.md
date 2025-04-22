# Smart Market 🛒
Projeto desenvolvido para ajudar pessoas a encontrar produtos de supermercados pelo menor preço.

![Smart Market](https://github.com/user-attachments/assets/072ccaf0-1488-4a57-9733-4b2c61e2aa83)

## Motivação ✨
- Todo mundo já fez alguma vez uma pesquisa de mercado para encontrar o menor preço do produto que deseja comprar.
- Parte dessas pesquisas são relacionadas a supermercados, onde geralmente é feita uma lista de compras.
- Nem sempre encontramos todos os produtos da lista em um único supermercado, ou por um bom preço.
- Pensando nisso, decidi desenvolver este projeto para ajudar pessoas em suas pesquisas.

## Lista de Tarefas 📝
- [x] Cluster de Scrapers (primeira versão)
- [x] API (primeira versão)
- [x] Website (primeira versão)
- [ ] IA para realizar ETL em encartes digitais

## Tecnologias 💻
- **Backend**
  - **Banco de dados**: PostgreSQL.
  - **Message Broker**: RabbitMQ.
  - **API**: Java, Spring Boot.
  - **Scrapers**: Typescript.
  - **Outros**: Docker.
- **Frontend**
  - **Site**: React.

## F.A.Q 💬
- **Como funciona a pipeline de dados do projeto?**
  1. A **API** periodicamente e de forma assíncrona (usando *Message Broker*), envia um comando para o cluster de scrapers ser executado.
  2. O **cluster de scrapers** recebe o comando enviado pela API, extrai, transforma e envia os dados para uma fila no *Message Broker*.
  3. A **API** ler as mensagens (publicadas pelo cluster) da fila no *Message Broker*, valida os dados e salva (ou atualiza) os dados no banco de dados.
- **Quais fontes de dados o projeto usa?**
  - Atualmente apenas produtos listados nos sites de supermercados, mas pretendo expandir para novos tipos de fontes de dados.
