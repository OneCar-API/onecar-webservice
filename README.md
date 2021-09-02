# OneCar Webservice

Este repositório é destinado à API do produto OneCar, seu site de vendas de carros.

## Iniciando as instalações

- Para executar o projeto será necessário a instalação do NodeJS e Docker.

### Instalação do NodeJS Linux

- Execute os comandos abaixo no terminal:

**Ubuntu**

```
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Debian, as root**

```
curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
apt-get install -y nodejs
```

### Instalação do NodeJS Windows

- Acesse o site do [NodeJS](https://nodejs.org/en/) e baixe a versão LTS:

### Instalação do Docker 

- Para instalar o Docker Engine, acesse o site do [Docker](https://docs.docker.com/engine/install) e escolha a distribuição da sua preferência. 
- Siga todos os passos listados.
- Por fim, para que não precise utilizar o sudo, execute os comandos presentes [nessa página](https://docs.docker.com/engine/install/linux-postinstall).


### Container Docker

- Agora deve-se criar um container com a imagem do PostgreSQL, executando:

```bash
# No lugar de your-password adicione a senha que desejar

docker run --name postgres -e POSTGRES_PASSWORD=your-password -e POSTGRES_DB=onecar -p 5432:5432 -d postgres
```

- Seu container foi criado com o USER padrão postgres, caso deseje atribuir um nome ao seu usuário, você pode adicionar o atributo 
```-e POSTGRES_USER=my-user```

- Neste momento seu container deve estar executando. Para confirmar execute:

```bash
docker ps
```

- Caso não tenha iniciado, execute:

```bash
docker start postgres
```

- E para parar o container, execute:

```bash
docker stop postgres
```


### Iniciando a aplicação

- Após fazer o clone do projeto, execute ```yarn``` ou ```npm install``` para instalar todas as dependências necessárias para que o projeto funcione.
- Agora os arquivos com variáveis ambiente (*.env*) e de conexão com o banco de dados (*ormconfig.json*) devem ser criados na raiz do projeto.
- Você pode executar os seguintes comandos para copiar os arquivos de exemplo com as informações necessárias para configuração.
```
$ cp ormconfig.example.json ormconfig.json

$ cp .env.example .env
```

- Ou pode criá-los manualmente pela interface gráfica e adicionar o seguinte conteúdo em cada um deles:

**.env**
```env
# Application
APP_SECRET=onecar

APP_WEB_URL=http://localhost:3000
APP_API_URL=http://localhost:3333

```

**ormconfig.json**
```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "your-password",
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

- Lembrando que se você adicionou o atributo ```-e POSTGRES_USER=my-user``` ao criar seu container Docker, você precisa trocar o *username* de **postgres** para **my-user**, por exemplo.

- Feito isso, as migrations precisarão ser executadas para que as tabelas sejam criadas no banco de dados. Para isso, utilize o comando abaixo:

```bash
yarn typeorm migration:run

# ou

npm typeorm migration:run
```


- Neste momento o servidor pode ser iniciado com o comando:
```bash
yarn dev

# ou

npm run dev
```

- A mensagem **Server started on port 3333** mostra que o servidor foi iniciado.
