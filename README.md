# Prática: Access Log API, Docker Compose e Load Balancer com Nginx

Repositório base para a atividade prática de desenvolvimento de uma API em Node.js com arquitetura em camadas (**Domain**, **Application**, **Interfaces** e **Infrastructure**), persistência em **PostgreSQL**, orquestração com **Docker Compose** e balanceamento de carga com **Nginx**.

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
   cp app/.env.example app/.env
   ```

---

## Estrutura do Projeto

```text
├── Dockerfile                       # Receita da imagem Node.js
├── docker-compose.yml               # Orquestração dos serviços (App + Postgres + Nginx)
├── database/
│   └── init.sql                     # [ETAPA 1] Script de criação da tabela access_log
├── nginx/
│   └── nginx.conf                   # [ETAPA 2] Configuração de proxy reverso e Load Balancer
└── app/
    ├── .env.example                 # Modelo de variáveis de ambiente
    ├── package.json                 # Dependências do projeto
    ├── server.js                    # [ETAPA 1] Registro da rota GET /api/access
    ├── domain/
    │   └── access-log.entity.js     # [ETAPA 1] Entidade e validação de hostname
    ├── application/
    │   └── access.service.js        # [ETAPA 1] Regra de log e contagem no banco
    ├── interfaces/
    │   └── controllers/
    │       └── access.controller.js # [ETAPA 1] Controller HTTP
    └── infrastructure/
        └── database/
            └── pg.config.js         # Fábrica de conexão com o PostgreSQL (pronto)
```

---

## Checklist da Atividade

### Etapa 1 — Persistência em Camadas e Docker Compose
- [ ] Criar a entidade `app/domain/access-log.entity.js`
- [ ] Criar o serviço `app/application/access.service.js`
- [ ] Criar o controller `app/interfaces/controllers/access.controller.js`
- [ ] Importar o controller e registrar a rota `GET /api/access` em `app/server.js`
- [ ] Criar o script `database/init.sql` com a tabela `access_log`
- [ ] Configurar o `docker-compose.yml` conectando a aplicação ao banco PostgreSQL e mapeando o `init.sql`
- [ ] Validar as rotas `GET /api/status` e `GET /api/access`

### Etapa 2 — Load Balancer com Nginx (3 Instâncias)
> **Atenção:** Inicie esta etapa somente após concluir e validar a Etapa 1.
- [ ] Criar `nginx/nginx.conf` com `upstream` e `proxy_pass`
- [ ] Remover a diretiva `ports` do serviço da API no `docker-compose.yml`
- [ ] Configurar 3 réplicas da aplicação (`deploy.replicas: 3`)
- [ ] Adicionar o serviço `nginx` ao `docker-compose.yml`
- [ ] Validar o balanceamento de carga (*Round-Robin*) e a persistência compartilhada

> Consulte o enunciado completo e o roteiro detalhado no Google Classroom.

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
  *(Na Etapa 2, substitua a porta pela porta exposta pelo Nginx).*

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

---

## Registro de Evidências e Resultados (Preenchimento pelo Aluno)

**Nome Completo:** `Seu Nome Aqui`  
**Turma / Semestre:** `20xx.x`

### 1. Evidências da Etapa 1 (Persistência em Camadas e Docker Compose)

**Saída do teste em `GET /api/status`:**
```text
(Cole aqui a saída do terminal/curl ou substitua por um print de tela)
```

**Saídas de múltiplas requisições em `GET /api/access` (evidenciando o incremento de `total_historical_hits`):**
```text
(Cole aqui as saídas de pelo menos 3 requisições ou substitua por prints de tela)
```

---

### 2. Evidências da Etapa 2 (Load Balancer com Nginx — 3 Instâncias)

**Saída do comando `docker compose ps` (mostrando 3 contêineres da API, 1 PostgreSQL e 1 Nginx):**
```text
(Cole aqui a saída do comando docker compose ps ou substitua por um print de tela)
```

**Saídas de pelo menos 6 requisições seguidas em `GET /api/access` via Nginx (evidenciando a alternância de `handled_by` entre os 3 contêineres e a contagem linear):**
```text
(Cole aqui as saídas das requisições ou substitua por prints de tela)
```

---

### 3. Análise Teórica e Boas Práticas

1. **Por que foi necessário remover a diretiva `ports` do serviço da aplicação Node.js ao escalar para 3 réplicas?**
   > *Escreva sua resposta aqui.*

2. **Qual o papel do volume persistente no PostgreSQL e da característica *stateless* da API nesse cenário de balanceamento de carga?**
   > *Escreva sua resposta aqui.*
