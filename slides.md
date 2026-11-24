---
marp: true
theme: default

---
# Engenharia de Aplicações Web Backend
## Orquestração Local e Persistência de Dados com Docker Compose

---

<!-- slide -->
# Introdução ao Ecossistema Docker Avançado
## Da Conteinerização à Orquestração

* **O Cenário Atual:** Até agora, você aprendeu a criar `Dockerfiles`, construir imagens isoladas e rodar contêineres individuais utilizando o comando `docker run`.
* **A Próxima Fronteira:** Aplicações de backend modernas do mundo real raramente vivem sozinhas em um único processo. Elas dependem de bancos de dados, sistemas de mensageria (RabbitMQ/Kafka), caches (Redis) e múltiplos microserviços.

----

* **O Objetivo Desta Aula:** Compreender como gerenciar ecossistemas complexos de múltiplos contêineres sem se perder em linhas de comando quilométricas, garantindo isolamento de rede e persistência segura de dados.

---

<!-- slide -->
# Slide 2: O Limite do `docker run`
## O Caos dos Comandos Imperativos

Para rodar uma API simples conectada a um banco de dados PostgreSQL usando apenas o CLI básico do Docker, você precisaria executar:

```bash
# Criar uma rede manual
docker network create minha-rede

# Subir o banco de dados com variáveis e mapeamentos
docker run -d --name meu-postgres --network minha-rede -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres:15-alpine

# Construir a imagem da API manualmente
docker build -t minha-api .

# Rodar a API conectada à mesma rede
docker run -d --name minha-api-app --network minha-rede -p 3000:3000 -e DB_HOST=meu-postgres minha-api
```
----
### Problemas Desta Abordagem:
1. **Dificuldade de Compartilhamento:** Falta de documentação viva da infraestrutura.
2. **Ordem de Execução Manual:** Se a API subir antes do banco estar pronto, ela falhará.
3. **Manutenibilidade Complexa:** Comandos extensos propensos a erros de digitação.

---

<!-- slide -->
# Slide 3: O que é o Docker Compose?
## A Abordagem Declarativa de Infraestrutura

O **Docker Compose** é uma ferramenta para definir e rodar aplicações multi-contêiner no Docker. Ele substitui a abordagem *imperativa* (comandos manuais passados passo a passo) por uma abordagem *declarativa* (definição exata de como a infraestrutura deve parecer através de um arquivo de configuração).

---
* **Arquivo Único:** Toda a topologia da sua aplicação (contêineres, redes, volumes, variáveis de ambiente, portas) é descrita em um arquivo `docker-compose.yml`.
* **Comando Único:** Toda a sua infraestrutura pode ser iniciada com `docker compose up` e destruída com `docker compose down`.
* **Ambientes Consistentes:** Garante que o ambiente de desenvolvimento de todos os desenvolvedores do time seja idêntico ao ambiente de staging ou de testes.

---

<!-- slide -->
# Slide 4: Arquitetura da Aplicação Alvo
## Topologia do Projeto Local de Backend

Neste guia, implementaremos a topologia clássica de um ecossistema backend moderno:

---

```text
[ Usuário / Host (Seu PC) ]
          │ (Porta 3000)
          ▼
┌────────────────────────────────────────────────────────┐
│ REDE INTERNA ISOLADA (Docker Network)                  │
│                                                        │
│   ┌─────────────────────┐       ┌───────────────────┐  │
│   │    Serviço: api     │──────>│ Serviço: database │  │
│   │ (minha_api_backend) │  DNS  │  (meu_postgres)   │  │
│   └─────────────────────┘       └───────────────────┘  │
│                                           │            │
└───────────────────────────────────────────┼────────────┘
                                            ▼
                                  ┌───────────────────┐
                                  │   Volume Nomeado  │
                                  │  (postgres_data)  │
                                  └───────────────────┘
```

---
* **API (Node/Python/Java/Go):** Expõe a porta 3000 para receber requisições HTTP externas.
* **Database (PostgreSQL):** Isolado na rede interna, persistindo dados de forma independente do ciclo de vida do contêiner.

---

<!-- slide -->
# Slide 5: Anatomia do `docker-compose.yml`
## Estrutura Básica e Sintaxe YAML

O arquivo é escrito em **YAML** (*YAML Ain't Markup Language*), que se baseia estritamente em **indentação com espaços** (nunca use tabs). Suas seções principais são:

---

1. **`name`**: Define o namespace/nome do projeto para isolar seus recursos de outros projetos no mesmo computador.
2. **`services`**: Onde definimos cada contêiner que fará parte da aplicação (os "atores").
3. **`networks`**: (Opcional) Configurações de redes customizadas. Se omitido, o Compose cria uma rede padrão automaticamente.
4. **`volumes`**: Declara os storages persistentes que serão compartilhados ou mantidos a longo prazo.

---

<!-- slide -->
# Slide 6: O Arquivo de Configuração Completo

```yaml
name: meu-projeto-backend

services:
  database:
    image: postgres:15-alpine
    container_name: meu_postgres
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: minha_api_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    container_name: minha_api_backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=database
      - DB_PORT=5432
      - DB_USER=admin
      - DB_PASS=secretpassword
      - DB_NAME=minha_api_db
    depends_on:
      - database

volumes:
  postgres_data:
```

---

<!-- slide -->
# Slide 7: O Serviço: Banco de Dados
## Entendendo as Diretivas do PostgreSQL

Vamos analisar o bloco `database`:

```yaml
  database:
    image: postgres:15-alpine
    container_name: meu_postgres
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: minha_api_db
    ports:
      - "5432:5432"
```
---
* **`image`**: Faz o download de uma imagem oficial e pré-configurada diretamente do Docker Hub. Usamos a versão `alpine` por ser extremamente leve.
* **`restart: always`**: Política de resiliência. Se o processo do banco cair por falta de memória ou falha interna, o Docker o reinicia imediatamente.
* **`environment`**: Injeta variáveis necessárias para inicializar o PostgreSQL criando o usuário, senha e o banco padrão automaticamente na primeira execução.
* **`ports`**: Mapeia `PortaDoSeuPC : PortaDoContêiner`. Permite conectar ferramentas de visualização (ex: DBeaver, pgAdmin) de fora do Docker.

---

<!-- slide -->
# Slide 8: O Serviço: A API Backend
## Compilação sob Demanda e Dependências

Análise do bloco `api`:

```yaml
  api:
    build: .
    container_name: minha_api_backend
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=database
    depends_on:
      - database
```
---
* **`build: .`**: Em vez de baixar uma imagem pronta, o Docker Compose procura por um arquivo chamado `Dockerfile` na pasta atual (`.`) e compila a imagem da API em tempo de execução.
* **`depends_on`**: Cria uma árvore de precedência. A API só começará a ser inicializada *após* o contêiner `database` estar em estado operacional.
* **`DB_HOST=database`**: Note que não apontamos para `localhost` ou para um IP fixo. Apontamos diretamente para o nome do serviço parceiro.

---

<!-- slide -->
# Slide 9: O Mecanismo de Redes Inter-contêiner
## Como a Comunicação Ocorre sem IPs Fixos

Quando você executa o Docker Compose, ele cria automaticamente uma **rede virtual privada isolada do tipo Bridge** exclusiva para o projeto.

```text
[ Rede Virtual do Projeto: meu-projeto-backend_default ]
   │
   ├──► Contêiner 'minha_api_backend'  ──► Conectado
   │
   └──► Contêiner 'meu_postgres'       ──► Conectado
```
---
### O Sistema de DNS Interno:
* O Docker possui um servidor de DNS embutido em seu motor core.
* Cada contêiner na rede é registrado automaticamente usando o **nome do seu serviço** como hostname.
* Portanto, quando a API tenta conectar em `database:5432`, o DNS do Docker resolve internamente para o IP privado correto daquele contêiner (ex: `172.20.0.3`).
* **Segurança Absoluta:** Serviços que não mapeiam a propriedade `ports` ficam completamente invisíveis para o mundo externo, mas permanecem visíveis para os contêineres irmãos dentro da rede.

---

<!-- slide -->
# Slide 10: O Problema da Amnésia dos Contêineres
## O Ciclo de Vida Efêmero

Para entender a necessidade de persistência de dados, precisamos revisar a arquitetura interna de armazenamento do Docker:

```text
┌────────────────────────────────────────────────────────┐
│ CAMADA DE ESCRITA EFFÊMERA (Container Layer - Read/Write)│ <-- Deletada no 'docker rm'
├────────────────────────────────────────────────────────┤
│ CAMADAS DE IMAGEM INALTERÁVEIS (Image Layers - Read-Only)│
└────────────────────────────────────────────────────────┘
```
---
* **Surgimento e Morte:** Imagens Docker são estáticas e compostas de camadas imutáveis de leitura. Quando um contêiner é instanciado, uma fina camada temporária de leitura/escrita é adicionada no topo.
* **O Desastre:** Todas as tabelas criadas no banco de dados, inserts de registros e configurações salvas residem originalmente nessa camada efêmera.
* Se você executar um `docker compose down`, o contêiner antigo é destruído, a camada efêmera é apagada do seu HD e **todos os dados do banco somem**.

---

<!-- slide -->
# Slide 11: A Solução: Docker Volumes
## Desviando o Fluxo de Dados para o Host

Um **Docker Volume** é um diretório criado e totalmente gerenciado pelo Docker localizado diretamente no sistema de arquivos do seu computador hospedeiro (fora do ciclo de vida efêmero do contêiner).

```text
 ┌──────────────────────┐                     ┌───────────────────────────┐
 │ CONTÊINER POSTGRES   │                     │ SISTEMA HOSPEDEIRO (HOST) │
 │                      │                     │                           │
 │ Caminho Interno:     │    Mapeamento /     │ Pasta Segura Gerenciada   │
 │ /var/lib/postgresql/ │ ◄─────────────────► │ pelo Docker no seu HD     │
 │ data                 │     Montagem        │ (Volume: postgres_data)   │
 └──────────────────────┘                     └───────────────────────────┘
```
---
* Quando o PostgreSQL escreve dados em seu diretório padrão interno, o Docker intercepta e desvia essa escrita diretamente para o volume seguro do Host.
* Se o contêiner morrer ou for destruído, os dados permanecem intactos no HD. Ao criar um novo contêiner conectado ao mesmo volume, o estado é totalmente restaurado.

---

<!-- slide -->
# Slide 12: Sintaxe de Mapeamento de Volumes
## Linha por Linha do Arquivo de Configuração

Vejamos como configuramos isso no `docker-compose.yml`:

```yaml
services:
  database:
    # ...
    volumes:
      - postgres_data:/var/lib/postgresql/data # <--- 1. Conexão

volumes:
  postgres_data: # <--- 2. Declaração Global
```
---
### 1. A Conexão / Montagem:
Usa a sintaxe estruturada `NOME_DO_VOLUME : CAMINHO_ALVO_DENTRO_DO_CONTÊINER`.
* `postgres_data`: Nome lógico do nosso volume.
* `/var/lib/postgresql/data`: Pasta oficial interna exigida pela imagem do PostgreSQL para guardar os arquivos de dados (tabelas, índices, logs do banco).

### 2. A Declaração Global:
Abaixo da raiz de serviços (`services:`), criamos o bloco `volumes:`. Isso instrui o Docker Compose a criar esse volume permanentemente no host caso ele ainda não exista.

---

<!-- slide -->
# Slide 13: Named Volumes vs. Bind Mounts
## Escolhendo a Estrutura Certa para o Backend

Existem duas abordagens clássicas para mapear arquivos no Docker Compose:

| Característica | **Named Volume** (Volumes Nomeados) | **Bind Mount** (Montagem Direta) |
| :--- | :--- | :--- |
| **Sintaxe Exemplo** | `postgres_data:/var/lib/postgresql/data` | `./src:/app/src` |
| **Localização Host** | Gerenciado em área oculta e isolada pelo Docker. | Uma pasta explícita no seu projeto atual. |

---

| Característica | **Named Volume** (Volumes Nomeados) | **Bind Mount** (Montagem Direta) |
| :--- | :--- | :--- |
| **Performance** | Altíssima performance nativa de I/O de disco. | Leve overhead devido à tradução de caminhos OS. |
| **Acesso Direto** | Difícil de abrir manualmente no Explorador de Arquivos. | Fácil acesso direto, alteração e edição pelo VS Code. |
| **Melhor Caso de Uso** | **Bancos de dados** (Postgres, MySQL, Redis, MongoDB). | **Código-fonte em Dev** (Hot-reload de código). |

---

<!-- slide -->
# Slide 14: Comandos Fundamentais do Ciclo de Vida
## Dominando o Terminal do Docker Compose

Certifique-se de estar na raiz da pasta que contém o arquivo `docker-compose.yml` para rodar os seguintes comandos fundamentais:

* **`docker compose up`**: Lê o arquivo, baixa imagens necessárias, cria redes/volumes, compila os Dockerfiles e inicia todos os contêineres exibindo logs agregados no terminal atual.
* **`docker compose up -d`**: O modo **Detached**. Faz exatamente o mesmo que o comando anterior, mas libera o terminal rodando toda a infraestrutura em segundo plano.
---

* **`docker compose ps`**: Exibe o status em tempo real de todos os contêineres mapeados sob este projeto específico.
* **`docker compose logs -f [nome-do-serviço]`**: Acompanha ao vivo (*tail*) os logs de um serviço específico (ex: `docker compose logs -f api`).
* **`docker compose stop`**: Pausa a execução dos contêineres sem remover nenhum recurso ou rede criada.
* **`docker compose down`**: Desliga, remove e destrói os contêineres e as redes criadas. **Importante:** Seus dados no banco de dados continuam salvos de forma segura devido ao uso de Volumes Nomeados!

---

<!-- slide -->
# Slide 15: Boas Práticas para Ambientes de Backend
## Diretrizes Essenciais para a Indústria

1. **Evite Imagens com a Tag `:latest`:** Sempre defina a versão exata da tecnologia usada (ex: `postgres:15-alpine`). Tags explícitas garantem reprodutibilidade e evitam que atualizações que quebrem compatibilidade quebrem seu projeto repentinamente.
2. **Segurança com `.env`:** Nunca escreva senhas de produção de forma exposta ("hardcoded") diretamente no `docker-compose.yml`. O Docker Compose lê automaticamente um arquivo chamado `.env` na mesma pasta. Mapeie as variáveis sensíveis usando `${VARIAVEL}`.
3. **Imagens Leves:** Utilize bases enxutas como distribuições `alpine` ou `slim` para reduzir drasticamente o tamanho das imagens, diminuir o consumo de rede e mitigar vulnerabilidades de segurança.
4. **Isolamento de Ambiente:** Mantenha um arquivo separado chamado `docker-compose.override.yml` para configurações locais de desenvolvimento e use o principal estritamente para a estrutura central.
