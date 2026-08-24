# Login API

API desenvolvida em **Java com Spring Boot**, integrada ao **MongoDB**, para gerenciamento de cadastro e autenticação de usuários da aplicação **Login-main**.

O projeto utiliza **JWT (JSON Web Token)** para autenticação e disponibiliza endpoints REST para comunicação com o aplicativo frontend.

## 🛠️ Tecnologias utilizadas

* Java 
* Spring Boot 
* Spring Data MongoDB
* MongoDB
* JWT
* Maven
* REST API

## 📁 Estrutura do projeto netbeans

```text
login-api/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ...
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## ⚙️ Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

* Java 17 ou superior
* Maven
* MongoDB (e o shell)
* NetBeans ou outra IDE compatível com projetos Maven

O MongoDB deve estar em execução localmente.

A conexão utilizada pelo projeto é feita através da porta padrão:
```text
mongodb://127.0.0.1:27017
```

## 🚀 Como executar

### 1. Clonar o projeto

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd login-api
```

### 2. Instalar as dependências

O projeto utiliza Maven. Pela IDE, execute um **Clean and Build** para baixar as dependências necessárias.

Também é possível utilizar:

```bash
mvn clean install
```

### 3. Iniciar o MongoDB

Certifique-se de que o MongoDB Server esteja em execução.

Para verificar a conexão, utilize:

```bash
mongosh
```

Se a conexão for estabelecida, o terminal deverá apresentar um prompt semelhante a:

```text
test>
```

### 4. Executar a aplicação

Localize a classe principal:

```text
LoginApiApplication.java
```

e execute a aplicação pelo NetBeans ou pela IDE utilizada.

Após a inicialização, a API estará disponível localmente na porta configurada no projeto.

Exemplo:

```text
http://localhost:8081
```

## 🔐 Autenticação

A API utiliza **JWT** para autenticação dos usuários.

Após o login, o token de autenticação pode ser utilizado para acessar endpoints que exigem autorização.

## 🔗 Integração com o frontend

O frontend **Login-main**, desenvolvido com Expo/React Native, utiliza uma variável de ambiente para definir o endereço da API.

Na raiz do projeto frontend, crie um arquivo `.env`:

Após alterar o `.env`, reinicie o servidor do Expo para que a variável seja carregada novamente.

## 📌 Observações

* O MongoDB precisa estar em execução para que as operações que utilizam o banco funcionem corretamente.
* O backend precisa estar iniciado antes de utilizar as funcionalidades de cadastro e login do frontend.
* Quando o frontend estiver sendo executado em outro dispositivo, como um celular, ele deve utilizar o endereço IP da máquina que executa o backend em vez de `localhost`.
* O arquivo `.env` não deve ser versionado caso contenha informações sensíveis ou específicas do ambiente.

## 👩‍💻 Projeto

Projeto desenvolvido para integração entre uma aplicação mobile/web e uma API REST utilizando **Spring Boot, MongoDB e JWT**.

# BANCO NO MONGODB:

<img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/76deaefc-fd0f-4487-877b-c1b89439179b" />

# APLICAÇÃO RODANDO JAVA + SPRINGBOOT

<img width="1910" height="929" alt="image" src="https://github.com/user-attachments/assets/63e30532-f8bc-489f-831d-7fecc60cc546" />


# TELA INICIAL DE PERFIL(APÓS O CADASTRO LOCAL)

<img width="1911" height="464" alt="image" src="https://github.com/user-attachments/assets/eaf7c62a-4909-4290-92e7-585aebedbd2c" />

# DEMONSTRAÇÃO DE LOGIN COM OS DADOS DO BANCO MONGODB:






