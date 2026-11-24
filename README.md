# Prática: Access Log API e Docker Compose

Repositório base para a atividade prática de desenvolvimento de uma API em Node.js com arquitetura em camadas (**Domain**, **Application**, **Interfaces** e **Infrastructure**), persistência em **PostgreSQL** e orquestração com **Docker Compose**.

---

## Pré-requisitos

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) e **Docker Compose** instalados e em execução

---

## Como começar

1. Clique no botão **"Use this template"** no topo deste repositório e selecione **"Create a new repository"**.
2. Clone o seu novo repositório localmente:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd <NOME_DA_PASTA>
   ```
3. Crie o arquivo `.env` a partir do modelo fornecido:
   ```bash
   cp .env.example .env
   ```

---

## Estrutura do Projeto

```text
├── Dockerfile                       # Receita da imagem Node.js
├── docker-compose.yml               # Orquestração dos serviços (App + Postgres)
├── database/
│   └── init.sql                     # [IMPLEMENTAR] Script de criação da tabela access_log
└── app/
    ├── .env.example                 # Modelo de variáveis de ambiente
    ├── package.json                 # Dependências do projeto
    ├── server.js                    # [COMPLETAR] Registro da rota GET /api/access
    ├── domain/
    │   └── access-log.entity.js     # [IMPLEMENTAR] Entidade e validação de hostname
    ├── application/
    │   └── access.service.js        # [IMPLEMENTAR] Regra de log e contagem no banco
    ├── interfaces/
    │   └── controllers/
    │       └── access.controller.js # [IMPLEMENTAR] Controller HTTP
    └── infrastructure/
        └── database/
            └── pg.config.js         # Fábrica de conexão com o PostgreSQL (pronto)
```

---

## Checklist da Atividade

- [ ] Criar a entidade `app/domain/access-log.entity.js`
- [ ] Criar o serviço `app/application/access.service.js`
- [ ] Criar o controller `app/interfaces/controllers/access.controller.js`
- [ ] Importar o controller e registrar a rota `GET /api/access` em `app/server.js`
- [ ] Criar o script `database/init.sql` com a tabela `access_log`
- [ ] Configurar o `docker-compose.yml` conectando a aplicação ao banco PostgreSQL e mapeando o `init.sql`

> Consulte o enunciado completo e os trechos de código no Google Classroom.

---

## Executando o Projeto

Suba os contêineres com o comando:

```bash
docker compose up --build
```

Para encerrar os serviços:

```bash
docker compose down
```

---

## Testando as Rotas

- **Status da API (já funcional):**
  ```bash
  curl http://localhost:3000/api/status
  ```

- **Registro e contagem de acessos:**
  ```bash
  curl http://localhost:3000/api/access
  ```

**Resposta esperada (`200 OK`):**
```json
{
  "status": "success",
  "meta": {
    "message": "Acesso processado e persistido."
  },
  "data": {
    "handled_by": "a1b2c3d4e5f6",
    "total_historical_hits": 1
  }
}
```
