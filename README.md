# OneCar Webservice

Este repositório é destinado à API do produto OneCar, seu site de vendas de carros.

## Iniciando as instalações

- Para executar o projeto será necessário a instalação do Docker.

### Instalação do Docker Ubuntu/Debian

No Linux, vamos instalar o Docker utilizando o `apt`, para isso, em seu terminal, execute os comandos abaixo:

```bash
sudo apt update
sudo apt remove docker docker-engine docker.io
sudo apt install docker.io
```

Agora com o Docker instalado, vamos habilitar para que seu serviço seja iniciado automaticamente com o sistema:

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

Para garantir que o Docker foi instalado da forma correta, execute no terminal:

```bash
docker version
```

Você precisará executar todos comandos do Docker utilizando o `sudo`, mas caso queira executa-los sem o `sudo`, utilize [esse guia](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).

### Windows (64 Bit)

O Docker no Windows possui alguns requisitos: 

- Microsoft Windows 10 Professional  ou Enterprise 64-bit
- Caso você possua o Windows 10 Home 64-bit também é possível usar o Docker mas será necessário instalar o WSL2 também (o instalador já se encarrega disso para você)

Caso você possua o Windows 32-bit, não será possível realizar a instalação do Docker.

Caso tenha todos requisitos, então faça a instalação do Docker para Windows:

[Docker Desktop for Mac and Windows | Docker](https://www.docker.com/products/docker-desktop)

Depois de instalar o Docker e abrir o software você já está pronto para continuar. Lembrando que essa versão do Docker para Windows tem uma interface visual muito bacana, ou seja, você pode usar a interface para visualizar os serviços sendo executados, logs, imagens e muito mais.

Para verificar que o Docker foi instalado corretamente, em **uma nova janela** do terminal execute:

```bash
docker version
```
## Instalação do Docker Compose

O Docker Compose precisará ser instalado apenas no Linux, já que nos demais sistemas ele já vem instalado junto com o Docker.

### Linux (Ubuntu/Debian)

- Rode o seguinte comando para instalar o Docker Compose:

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

- Aplique as permissões necessárias ao binário:

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

Após isso, rode o comando `docker-compose --version` para assegurar que a instalação foi um sucesso. Caso retorne algum erro (mesmo reiniciando o terminal), crie um link simbólico para `usr/bin` com o seguinte comando:

```bash
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

Por fim, teste novamente com o comando `docker-compose --version` para checar se está tudo funcionando.

### Iniciando a aplicação

- Após fazer o clone do projeto, execute ```yarn``` ou ```npm install``` para instalar todas as dependências necessárias para que o projeto funcione.
- Agora os arquivos com variáveis ambiente (*.env*) e de conexão com o banco de dados (*ormconfig.json*) devem ser criados na raiz do projeto.
- Você pode executar os seguintes comandos para copiar os arquivos de exemplo com as informações necessárias para configuração.
```
cp ormconfig.example.json ormconfig.json

cp .env.example .env
```

- Ou pode criá-los manualmente pela interface gráfica e adicionar o seguinte conteúdo em cada um deles:

**.env**
```env
# Application
APP_SECRET=onecar-webservice

APP_WEB_URL=http://localhost:3000
APP_API_URL=http://localhost:3333

```

**ormconfig.json**
```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "root",
  "password": "admin123",
  "database": "onecar",
  "entities": [
    "./src/models/*.ts"
  ],
  "migrations": [
    "./src/database/migrations/*.ts"
  ],
  "cli": {
    "migrationsDir": "./src/database/migrations"
  }
}

```

- Agora vamos subir o container do Docker utilizando o comando ```docker-compose up -d```, isso fará a instalação do NodeJS e a conexão com o banco de dados.

- Neste momento o servidor foi iniciado e você pode visualizar os logs da aplicação com o comando ```docker logs onecar -f```.

- A mensagem **Server started on port 3333** mostra que o servidor foi iniciado.

- Por fim, as migrations precisarão ser executadas para que as tabelas sejam criadas no banco de dados. Para isso, utilize o comando abaixo:

```bash
yarn typeorm migration:run

# ou

npm typeorm migration:run
```


