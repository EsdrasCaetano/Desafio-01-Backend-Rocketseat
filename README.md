# API de Gerenciamento de Tasks

Essa API permite realizar operações CRUD (Create, Read, Update, Delete) em tarefas (*tasks*). Além disso, é possível importar várias tasks de um arquivo CSV.

## Funcionalidades

1. **Criação de uma Task**
   - Rota: `POST /tasks`
   - Descrição: Cria uma nova task com os campos `title` e `description` fornecidos no corpo da requisição.
   - Campos obrigatórios:
     - `title`: Título da task.
     - `description`: Descrição detalhada da task.
   - Campos automáticos:
     - `id`: Identificador único gerado automaticamente.
     - `completed_at`: Inicialmente `null`.
     - `created_at`: Data de criação da task.
     - `updated_at`: Data de atualização da task.

2. **Listagem de todas as Tasks**
   - Rota: `GET /tasks`
   - Descrição: Lista todas as tasks salvas no banco de dados.
   - Filtro opcional:
     - Parâmetro `search`: Filtra as tasks pelo `title` ou `description`.

3. **Atualização de uma Task pelo ID**
   - Rota: `PUT /tasks/:id`
   - Descrição: Atualiza os campos `title` e/ou `description` de uma task específica.
   - Regras:
     - O `id` deve existir no banco de dados.
     - É possível atualizar apenas um dos campos (`title` ou `description`) sem afetar o outro.
     - O campo `updated_at` será automaticamente atualizado.

4. **Remoção de uma Task pelo ID**
   - Rota: `DELETE /tasks/:id`
   - Descrição: Remove uma task específica do banco de dados.
   - Regras:
     - O `id` deve existir no banco de dados.

5. **Marcar uma Task como Completa/Incompleta**
   - Rota: `PATCH /tasks/:id/complete`
   - Descrição: Alterna o estado da task entre "completa" e "incompleta".
   - Regras:
     - O `id` deve existir no banco de dados.
     - Se a task estiver completa (`completed_at` preenchido), ela voltará ao estado incompleto (`completed_at = null`).

6. **Exportação de Tasks para CSV**
   - Rota: `GET /tasks/export`
   - Descrição: Exporta todas as tasks para um arquivo CSV chamado `tasks.csv`.
   - Regras:
     - O arquivo é salvo no servidor e o cliente recebe uma mensagem informando que a exportação foi iniciada.


---

## Requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Um navegador ou ferramenta como Insomnia/Postman para testar as rotas.

---
