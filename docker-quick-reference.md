# 🐳 Guia de Referência Rápida: Comandos Docker

Este guia consolida os principais comandos para o dia a dia de desenvolvimento e gestão de infraestrutura com Docker.

---

## 📦 1. Gestão de Imagens
Comandos para criar, baixar e gerenciar os artefatos baseados no `Dockerfile`.

| Comando | O que faz | Exemplo Prático |
| :--- | :--- | :--- |
| **`docker build`** | Constrói uma imagem a partir de um `Dockerfile`. | `docker build -t minha-api:1.0 .` |
| **`docker images`** | Lista todas as imagens baixadas ou construídas localmente. | `docker images` |
| **`docker pull`** | Baixa uma imagem de um Registry (ex: Docker Hub) sem executá-la. | `docker pull node:20-alpine` |
| **`docker rmi`** | Remove uma imagem do disco local. *(A imagem não pode estar em uso)*. | `docker rmi minha-api:1.0` |
| **`docker save`** | Exporta uma imagem para um arquivo físico `.tar`. | `docker save -o api.tar minha-api:1.0` |
| **`docker load`** | Importa uma imagem a partir de um arquivo `.tar`. | `docker load -i api.tar` |

---

## 🚀 2. Gestão de Containers
Comandos para instanciar as imagens e controlar os processos vivos.

| Comando | O que faz | Exemplo Prático |
| :--- | :--- | :--- |
| **`docker run`** | Cria e inicia um novo container a partir de uma imagem. | `docker run -d -p 80:3000 minha-api:1.0` |
| **`docker ps`** | Lista os containers que estão rodando no momento. | `docker ps` |
| **`docker ps -a`** | Lista **todos** os containers (rodando, parados ou que falharam). | `docker ps -a` |
| **`docker stop`** | Para a execução de um container de forma graciosa (envia `SIGTERM`). | `docker stop id_ou_nome_container` |
| **`docker start`** | Inicia um container que estava parado. | `docker start id_ou_nome_container` |
| **`docker rm`** | Remove um container destruído/parado. Use `-f` para forçar. | `docker rm id_ou_nome_container` |

---

## 🔍 3. Diagnóstico e Interação
Comandos vitais para debugar aplicações containerizadas, já que não temos acesso visual direto ao ambiente.

| Comando | O que faz | Exemplo Prático |
| :--- | :--- | :--- |
| **`docker logs`** | Exibe a saída padrão (stdout/stderr) da aplicação. Use `-f` para tempo real. | `docker logs -f id_ou_nome_container` |
| **`docker exec`** | Executa um comando dentro de um container que já está rodando. | `docker exec -it meu_container sh` (Abre o terminal interativo) |
| **`docker inspect`** | Retorna um JSON enorme com detalhes de baixo nível (IPs, volumes, redes). | `docker inspect meu_container` |
| **`docker stats`** | Mostra o consumo em tempo real de CPU, Memória e Rede dos containers. | `docker stats` |

---

## 🛠️ 4. Flags Essenciais do `docker run`
O comando `run` é o mais rico do ecossistema. Estas são as flags indispensáveis:

* **`-d` (Detached):** Libera o seu terminal, rodando o container em background.
* **`-p host:container` (Publish):** Mapeia a porta da sua máquina física para a porta interna do container. *(Ex: `-p 8080:3000`)*.
* **`-e CHAVE=valor` (Env):** Injeta uma variável de ambiente no container.
* **`--env-file arquivo.env`:** Injeta um arquivo inteiro de variáveis de ambiente.
* **`-v host:container` (Volume):** Faz o *Bind Mount*, espelhando uma pasta da sua máquina para dentro do container. *(Ex: `-v ./dados:/app/dados`)*.
* **`--name meu_nome`:** Define um nome fixo e legível para o container, facilitando o gerenciamento posterior.
* **`--network minha_rede`:** Conecta o container a uma rede virtual específica do Docker.

---

## 🧹 5. Manutenção do Sistema
O Docker pode consumir muito espaço em disco acumulando imagens órfãs e containers parados.

| Comando | O que faz |
| :--- | :--- |
| **`docker system prune`** | Limpa **tudo** que não está sendo usado (containers parados, redes sem uso e imagens sem tag/órfãs). |
| **`docker system prune -a`** | Versão agressiva: Apaga **todas** as imagens locais que não estão atreladas a um container em execução no momento. Excelente para liberar muito disco. |