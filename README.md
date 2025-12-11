# Events API (Cadastro de Eventos)

API simples em Node.js + Express para cadastro de eventos (projeto acadêmico).

## Endpoints
- `POST /events` - cadastrar evento
  - body JSON: { "nome": "Nome do evento", "localizacao": "Local", "dataDoEvento": "YYYY-MM-DD", "periodoInscricao": "dd/mm - dd/mm" }
- `GET /events` - listar todos os eventos
- `GET /events/:id` - obter evento por id
- `PUT /events/:id` - atualizar evento (mesmo body do POST)
- `DELETE /events/:id` - deletar evento por id

## Como rodar
1. Instalar dependências:
   ```
   npm install
   ```
2. Iniciar:
   ```
   npm start
   ```
3. A API ficará disponível em `http://localhost:3000`

## Observações
- Persistência simples usando um arquivo JSON (`/data/events.json`). Para um projeto real, trocar por banco de dados.
- O projeto inclui configuração inicial para ESLint (Airbnb) e Prettier no `package.json` como dependências de desenvolvimento.
