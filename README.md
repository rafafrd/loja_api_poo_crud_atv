# 🛒 Sales Order API

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![SonarQube](https://img.shields.io/badge/SonarQube-Aprovado-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white)

![Status](https://img.shields.io/badge/status-ativo-brightgreen?style=flat-square)
![Arquitetura](https://img.shields.io/badge/arquitetura-em%20camadas-blueviolet?style=flat-square)
![Padrão](https://img.shields.io/badge/padrão-Factory%20Method-orange?style=flat-square)
![OOP](https://img.shields.io/badge/paradigma-OOP-informational?style=flat-square)
![Multer](https://img.shields.io/badge/upload-Multer-FF6C37?style=flat-square)

</div>

> API RESTful para gerenciamento de **Pedidos de Venda** desenvolvida com **TypeScript**, **Express** e **MySQL2**. O projeto aplica **Orientação a Objetos** com herança, abstração e encapsulamento, além dos padrões de projeto **Factory Method**, **Repository** e **Singleton**, organizados em uma arquitetura limpa em camadas.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura](#️-arquitetura)
- [Modelo de Domínio](#-modelo-de-domínio-oop)
- [Banco de Dados](#️-banco-de-dados)
- [Ciclo de Vida de uma Requisição](#-ciclo-de-vida-de-uma-requisição)
- [Endpoints da API](#-endpoints-da-api)
- [Validações de Negócio](#-validações-de-negócio)
- [Padrões de Projeto](#-padrões-de-projeto)
- [Tecnologias](#-tecnologias)
- [Qualidade de Código](#-qualidade-de-código)
- [Como Executar](#-como-executar)

---

## 🔎 Visão Geral

A **Sales Order API** é um sistema backend completo para gestão de vendas, cobrindo o ciclo inteiro: cadastro de **Categorias**, **Produtos** (com upload de imagem via Multer), **Clientes**, **Vendedores** e **Pedidos** com seus respectivos itens.

O projeto foi construído com foco em:

- **Separação de responsabilidades** rigorosa entre as camadas
- **Entidades ricas** com validações encapsuladas nas próprias classes de domínio
- **Transações atômicas** no banco de dados (BEGIN / COMMIT / ROLLBACK)
- **Herança e abstração** via classe `Pessoa` para `Cliente` e `Vendedor`
- **Código aprovado** pelo SonarQube sem issues críticas

---

## 📁 Estrutura do Projeto

```
├── 📁 docs
│   ├── 📝 atividade.md            # Requisitos do projeto
│   ├── 📄 db.sql                  # Schema completo do banco de dados
│   ├── 📄 insomnia.json           # Collection para importar no Insomnia
│   ├── 📝 testes.md               # Guia de testes com cenários e bodies
│   └── 📝 diagram.md              # Diagramas ERD e de fluxo
├── 📁 src
│   ├── 📁 config
│   │   ├── 📁 enum
│   │   │   └── 📄 EnvKey.ts           # Enum com as chaves de variáveis de ambiente
│   │   ├── 📄 EnvVar.ts               # Carregamento e acesso às variáveis de ambiente
│   │   └── 📄 produto.multer.ts       # Configuração do Multer para upload de imagens
│   ├── 📁 controllers
│   │   ├── 📄 categoria.controller.ts
│   │   ├── 📄 cliente.controller.ts
│   │   ├── 📄 pedido.controller.ts
│   │   ├── 📄 produto.controller.ts
│   │   └── 📄 vendedor.controller.ts
│   ├── 📁 database
│   │   └── 📄 db.connection.ts        # Pool de conexão MySQL2 (Singleton)
│   ├── 📁 middleware
│   │   └── 📄 upload.middleware.ts    # Middleware de upload de arquivos
│   ├── 📁 models
│   │   ├── 📄 pessoa.model.ts         # Classe abstrata base (herança)
│   │   ├── 📄 cliente.model.ts        # Herda de Pessoa
│   │   ├── 📄 vendedor.model.ts       # Herda de Pessoa
│   │   ├── 📄 categoria.model.ts
│   │   ├── 📄 produto.model.ts
│   │   ├── 📄 pedido.model.ts         # Agrega ItemPedido + calcularTotal()
│   │   └── 📄 itemPedido.model.ts
│   ├── 📁 repository
│   │   ├── 📄 categoria.repository.ts
│   │   ├── 📄 cliente.repository.ts
│   │   ├── 📄 pedido.repository.ts    # Transação atômica BEGIN/COMMIT/ROLLBACK
│   │   ├── 📄 produto.repository.ts
│   │   └── 📄 vendedor.repository.ts
│   ├── 📁 routes
│   │   ├── 📄 routes.ts               # Roteador raiz (agrega todos os routers)
│   │   ├── 📄 categoria.routes.ts
│   │   ├── 📄 cliente.routes.ts
│   │   ├── 📄 pedido.routes.ts
│   │   ├── 📄 produto.routes.ts
│   │   └── 📄 vendedor.routes.ts
│   ├── 📁 services
│   │   ├── 📄 categoria.service.ts
│   │   ├── 📄 cliente.service.ts
│   │   ├── 📄 pedido.service.ts
│   │   ├── 📄 produto.service.ts
│   │   └── 📄 vendedor.service.ts
│   └── 📄 server.ts                   # Ponto de entrada da aplicação Express
├── 📁 uploads
│   └── 📁 images                      # Imagens enviadas pelo Multer
├── ⚙️ .gitignore
├── ⚙️ package.json
└── ⚙️ tsconfig.json
```

---

## 🏗️ Arquitetura

O projeto adota uma **arquitetura em 4 camadas** com fluxo de dependência unidirecional. O roteador raiz agrega todos os sub-roteadores, e cada camada possui uma responsabilidade única e bem definida.

```mermaid
Flowchat TD

    Client(["🌐 Cliente HTTP\n(Insomnia / Postman)"])

    subgraph ExpressLayer["⚡ Camada Express"]
        Router["📍 routes.ts\n(Roteador Raiz)"]
        R1["categoria.routes.ts"]
        R2["produto.routes.ts"]
        R3["cliente.routes.ts"]
        R4["vendedor.routes.ts"]
        R5["pedido.routes.ts"]
        Router --> R1 & R2 & R3 & R4 & R5
    end

    subgraph ControllerLayer["🎮 Camada Controller"]
        CC["CategoriaController"]
        PC["ProdutoController"]
        CLC["ClienteController"]
        VC["VendedorController"]
        PDC["PedidoController"]
    end

    subgraph ServiceLayer["⚙️ Camada Service"]
        CS["CategoriaService"]
        PS["ProdutoService"]
        CLS["ClienteService"]
        VS["VendedorService"]
        PDS["PedidoService"]
    end

    subgraph RepositoryLayer["🗃️ Camada Repository"]
        CR["CategoriaRepository"]
        PR["ProdutoRepository"]
        CLR["ClienteRepository"]
        VR["VendedorRepository"]
        PDR["PedidoRepository\n⚛️ Transação Atômica"]
    end

    subgraph ModelLayer["🧬 Camada Model / Domínio"]
        Pessoa["«abstract»\nPessoa"]
        Cliente["Cliente"]
        Vendedor["Vendedor"]
        Categoria["Categoria"]
        Produto["Produto"]
        Pedido["Pedido\ncalcularTotal()"]
        Item["ItemPedido\nSubtotal getter"]
        Pessoa -->|herança| Cliente
        Pessoa -->|herança| Vendedor
        Pedido -->|agrega| Item
    end

    DB[("🗄️ MySQL 8\nSingleton Pool")]

    Client -->|"HTTP Request"| Router
    R1 --> CC
    R2 --> PC
    R3 --> CLC
    R4 --> VC
    R5 --> PDC
    CC --> CS --> CR
    PC --> PS --> PR
    CLC --> CLS --> CLR
    VC --> VS --> VR
    PDC --> PDS --> PDR
    CS --> Categoria
    PS --> Produto
    CLS --> Cliente
    VS --> Vendedor
    PDS --> Pedido
    CR & PR & CLR & VR & PDR -->|"SQL parametrizado"| DB
```

### Responsabilidades por Camada

| Camada         | Arquivo(s)        | Responsabilidade                                                    |
| -------------- | ----------------- | ------------------------------------------------------------------- |
| **Route**      | `*.routes.ts`     | Mapear verbos HTTP para métodos do Controller                       |
| **Controller** | `*.controller.ts` | Receber requisições HTTP, validar entrada, retornar respostas       |
| **Service**    | `*.service.ts`    | Orquestrar regras de negócio, instanciar objetos via Factory Method |
| **Repository** | `*.repository.ts` | Executar queries SQL com parâmetros seguros contra SQL Injection    |
| **Model**      | `*.model.ts`      | Representar entidades com validações internas e encapsulamento      |

---

## 🧬 Modelo de Domínio (OOP)

A camada de domínio utiliza **herança**, **abstração**, **encapsulamento** e **polimorfismo** para modelar as entidades. O padrão **Factory Method** é aplicado como métodos estáticos descritivos.

```mermaid
classDiagram
    class Pessoa {
        <<abstract>>
        -readonly _id: number | null
        -_nome: string
        +get Id() number
        +get Nome() string
        +set Nome(valor: string)
        +getTipo()* string
        +exibirDetalhes()* void
        -validarNome(nome: string) string
    }

    class Cliente {
        -_email: string
        +get Email() string
        +set Email(valor: string)
        +getTipo() string
        +exibirDetalhes() void
        +$criar(nome, email) Cliente
        +$fromDB(row: ICliente) Cliente
        +$editar(id, nome, email) Cliente
        -validarEmail(email: string) string
    }

    class Vendedor {
        +getTipo() string
        +exibirDetalhes() void
        +$criar(nome) Vendedor
        +$fromDB(row: IVendedor) Vendedor
        +$editar(id, nome) Vendedor
    }

    class Categoria {
        -readonly _id: number | null
        -_nome: string
        +get Id() number
        +get Nome() string
        +set Nome(valor: string)
        +$criar(nome) Categoria
        +$fromDB(row: ICategoria) Categoria
        +$editar(id, nome) Categoria
        -validarNome(nome: string) string
    }

    class Produto {
        -readonly _id: number | null
        -_nome: string
        -_preco: number
        -_categoriaId: number
        -_vincutoImagem: string | null
        +get Preco() number
        +get CategoriaId() number
        +get VincutoImagem() string
        +set Preco(valor: number)
        +$criar(nome, preco, catId, img?) Produto
        +$fromDB(row: IProduto) Produto
        +$editar(id, nome, preco, catId, img?) Produto
        -validarNome(nome: string) string
        -validarPreco(preco: number) number
    }

    class Pedido {
        -readonly _id: number | null
        -readonly _dataPedido: Date
        -_clienteId: number
        -_vendedorId: number
        -_itens: ItemPedido[]
        -_valorFinal: number
        +get ValorFinal() number
        +get Itens() ItemPedido[]
        +calcularTotal() number
        +adicionarItem(item) void
        +$criar(clienteId, vendedorId, itens) Pedido
        +$fromDB(row, itens?) Pedido
    }

    class ItemPedido {
        -readonly _id: number | null
        -readonly _pedidoId: number | null
        -_produtoId: number
        -_quantidade: number
        -_precoUnitario: number
        +get Subtotal() number
        +$criar(produtoId, qtd, preco) ItemPedido
        +$fromDB(row: IItemPedido) ItemPedido
        +$comPedido(pedidoId, ...) ItemPedido
        -validarQuantidade(qtd) number
        -validarPreco(preco) number
    }

    Pessoa <|-- Cliente : herança
    Pessoa <|-- Vendedor : herança
    Pedido "1" *-- "N" ItemPedido : agrega
```

---

## 🗄️ Banco de Dados

O banco utiliza **MySQL 8** com chaves estrangeiras, restrições de integridade e registro automático de data de pedido via `DEFAULT CURRENT_TIMESTAMP`.

### Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    CATEGORIAS ||--o{ PRODUTOS : "possui"
    CLIENTES ||--o{ PEDIDOS : "realiza"
    VENDEDORES ||--o{ PEDIDOS : "atende"
    PEDIDOS ||--|{ ITENSPEDIDOS : "contém"
    PRODUTOS ||--o{ ITENSPEDIDOS : "listado_em"

    CATEGORIAS {
        int id_categoria PK
        varchar nome
    }
    PRODUTOS {
        int id_produto PK
        varchar nome
        decimal preco
        int id_categoria FK
        varchar vinculo_imagem
    }
    CLIENTES {
        int id_cliente PK
        varchar nome
        varchar email
    }
    VENDEDORES {
        int id_vendedor PK
        varchar nome
    }
    PEDIDOS {
        int id_pedido PK
        datetime data_pedido
        int id_cliente FK
        int id_vendedor FK
        decimal valor_final
    }
    ITENSPEDIDOS {
        int id_item PK
        int id_pedido FK
        int id_produto FK
        int quantidade
        decimal preco_unitario
    }
```

### Relacionamentos

| Relacionamento        | Cardinalidade | Descrição                                |
| --------------------- | ------------- | ---------------------------------------- |
| Categoria → Produto   | 1:N           | Uma categoria possui vários produtos     |
| Cliente → Pedido      | 1:N           | Um cliente pode realizar vários pedidos  |
| Vendedor → Pedido     | 1:N           | Um vendedor pode atender vários pedidos  |
| Pedido → ItensPedido  | 1:N           | Um pedido contém vários itens            |
| Produto → ItensPedido | 1:N           | Um produto pode aparecer em vários itens |

---

## 🔄 Ciclo de Vida de uma Requisição

### Criação de Pedido (`POST /pedidos`)

```mermaid
sequenceDiagram
    actor Cliente
    participant Router as 📍 Router
    participant Controller as 🎮 PedidoController
    participant Service as ⚙️ PedidoService
    participant ItemModel as 🧬 ItemPedido (Factory)
    participant PedidoModel as 🧬 Pedido (Factory)
    participant Repository as 🗃️ PedidoRepository
    participant DB as 🗄️ MySQL

    Cliente->>Router: POST /pedidos
    Note over Cliente,Router: Body: { clienteId, vendedorId, itens[] }

    Router->>Controller: criar(req, res)
    Controller->>Controller: Valida clienteId, vendedorId e array itens
    alt Campos inválidos
        Controller-->>Cliente: 400 { "mensagem": "..." }
    end

    Controller->>Service: criar(clienteId, vendedorId, itensInput[])

    loop Para cada item do array
        Service->>ItemModel: ItemPedido.criar(produtoId, quantidade, precoUnitario)
        ItemModel->>ItemModel: validarQuantidade() + validarPreco()
        ItemModel-->>Service: instância ItemPedido validada
    end

    Service->>PedidoModel: Pedido.criar(clienteId, vendedorId, itens[])
    PedidoModel->>PedidoModel: calcularTotal() → soma Subtotals
    PedidoModel-->>Service: instância Pedido com valorFinal calculado

    Service->>Repository: create(pedido)
    Repository->>DB: BEGIN TRANSACTION
    Repository->>DB: INSERT INTO pedidos (...)
    DB-->>Repository: insertId do pedido

    loop Para cada ItemPedido
        Repository->>DB: INSERT INTO itenspedidos (id_pedido, ...)
    end

    Repository->>DB: COMMIT
    DB-->>Repository: OK
    Repository-->>Service: ResultSetHeader { insertId }

    Service->>Repository: findById(insertId)
    Repository-->>Service: Pedido completo com itens

    Service-->>Controller: Pedido
    Controller-->>Cliente: 201 Created — pedido com valor_final calculado
```

### Fluxo de Rollback em caso de falha

```mermaid
flowchart LR
    A(["POST /pedidos"]) --> B["BEGIN TRANSACTION"]
    B --> C["INSERT pedido"]
    C --> D{"Sucesso?"}
    D -->|Sim| E["INSERT itens..."]
    E --> F{"Todos OK?"}
    F -->|Sim| G["COMMIT"]
    F -->|Não| H["ROLLBACK"]
    D -->|Não| H
    G --> I(["✅ 201 Created"])
    H --> J(["❌ 500 Erro — nada foi salvo"])
```

---

## 📡 Endpoints da API

### 📦 Categorias — `/categorias`

| Método   | Rota              | Descrição                 |
| -------- | ----------------- | ------------------------- |
| `GET`    | `/categorias`     | Lista todas as categorias |
| `GET`    | `/categorias/:id` | Busca categoria por ID    |
| `POST`   | `/categorias`     | Cria uma nova categoria   |
| `PUT`    | `/categorias/:id` | Atualiza uma categoria    |
| `DELETE` | `/categorias/:id` | Remove uma categoria      |

### 🏷️ Produtos — `/produtos`

| Método   | Rota                               | Descrição                                |
| -------- | ---------------------------------- | ---------------------------------------- |
| `GET`    | `/produtos`                        | Lista todos os produtos                  |
| `GET`    | `/produtos/:id`                    | Busca produto por ID                     |
| `GET`    | `/produtos/categoria/:categoriaId` | Lista produtos por categoria             |
| `POST`   | `/produtos`                        | Cria produto (`multipart/form-data`)     |
| `PUT`    | `/produtos/:id`                    | Atualiza produto (`multipart/form-data`) |
| `DELETE` | `/produtos/:id`                    | Remove um produto                        |

### 👤 Clientes — `/clientes`

| Método   | Rota            | Descrição               |
| -------- | --------------- | ----------------------- |
| `GET`    | `/clientes`     | Lista todos os clientes |
| `GET`    | `/clientes/:id` | Busca cliente por ID    |
| `POST`   | `/clientes`     | Cria um novo cliente    |
| `PUT`    | `/clientes/:id` | Atualiza um cliente     |
| `DELETE` | `/clientes/:id` | Remove um cliente       |

### 🧑‍💼 Vendedores — `/vendedores`

| Método   | Rota              | Descrição                 |
| -------- | ----------------- | ------------------------- |
| `GET`    | `/vendedores`     | Lista todos os vendedores |
| `GET`    | `/vendedores/:id` | Busca vendedor por ID     |
| `POST`   | `/vendedores`     | Cria um novo vendedor     |
| `PUT`    | `/vendedores/:id` | Atualiza um vendedor      |
| `DELETE` | `/vendedores/:id` | Remove um vendedor        |

### 🧾 Pedidos — `/pedidos`

| Método   | Rota           | Descrição                               |
| -------- | -------------- | --------------------------------------- |
| `GET`    | `/pedidos`     | Lista todos os pedidos com itens        |
| `GET`    | `/pedidos/:id` | Busca pedido por ID com itens embutidos |
| `POST`   | `/pedidos`     | Cria pedido + itens em transação única  |
| `DELETE` | `/pedidos/:id` | Remove pedido e seus itens              |

### Mapa de Rotas

```mermaid
mindmap
  root(("🌐 API\nlocalhost:8000"))
    /categorias
      GET - Lista todas
      GET /:id - Por ID
      POST - Criar
      PUT /:id - Editar
      DELETE /:id - Remover
    /produtos
      GET - Lista todos
      GET /:id - Por ID
      GET /categoria/:id
      POST - Criar com imagem
      PUT /:id - Editar com imagem
      DELETE /:id - Remover
    /clientes
      GET - Lista todos
      GET /:id - Por ID
      POST - Criar
      PUT /:id - Editar
      DELETE /:id - Remover
    /vendedores
      GET - Lista todos
      GET /:id - Por ID
      POST - Criar
      PUT /:id - Editar
      DELETE /:id - Remover
    /pedidos
      GET - Lista com itens
      GET /:id - Por ID com itens
      POST - Criar com itens
      DELETE /:id - Remover
```

### Códigos HTTP

```mermaid
flowchart LR
    A["Operação"] --> B{Resultado}
    B -->|"Leitura com sucesso"| C["✅ 200 OK"]
    B -->|"Criação com sucesso"| D["✅ 201 Created"]
    B -->|"Deleção com sucesso"| E["✅ 204 No Content"]
    B -->|"Body ou params inválidos"| F["⚠️ 400 Bad Request"]
    B -->|"Recurso não existe"| G["⚠️ 404 Not Found"]
    B -->|"Erro no servidor/banco"| H["❌ 500 Internal Server Error"]
```

---

## ✅ Validações de Negócio

As validações são aplicadas diretamente nas **classes de domínio**, garantindo que nenhum objeto inválido chegue ao banco de dados.

```mermaid
flowchart TD
    Input(["📥 Dados de entrada"]) --> V1

    V1{"nome ≥ 3 chars?"}
    V1 -->|Não| E1(["❌ Nome deve ter\npelo menos 3 caracteres"])
    V1 -->|Sim| V2{"Qual entidade?"}

    V2 -->|Cliente| V3{"email válido?\nregex"}
    V3 -->|Não| E2(["❌ E-mail inválido"])
    V3 -->|Sim| OK1(["✅ Cliente válido"])

    V2 -->|Produto| V4{"preco > 0?"}
    V4 -->|Não| E3(["❌ Preço deve ser\nmaior que zero"])
    V4 -->|Sim| OK2(["✅ Produto válido"])

    V2 -->|ItemPedido| V5{"quantidade ≥ 1\ninteiro?"}
    V5 -->|Não| E4(["❌ Quantidade deve ser\ninteiro ≥ 1"])
    V5 -->|Sim| V6{"precoUnitario > 0?"}
    V6 -->|Não| E5(["❌ Preço unitário deve\nser maior que zero"])
    V6 -->|Sim| OK3(["✅ Item válido"])

    V2 -->|Pedido| V7{"itens.length > 0?"}
    V7 -->|Não| E6(["❌ Pedido deve ter\npelo menos 1 item"])
    V7 -->|Sim| OK4(["✅ Pedido válido\ncalcularTotal()"])
```

| Entidade     | Campo           | Regra                                 |
| ------------ | --------------- | ------------------------------------- |
| `Pessoa`     | `nome`          | Mínimo 3 caracteres após trim         |
| `Cliente`    | `email`         | Formato válido: `usuario@dominio.ext` |
| `Produto`    | `nome`          | Mínimo 3 caracteres                   |
| `Produto`    | `preco`         | Maior que zero                        |
| `ItemPedido` | `quantidade`    | Inteiro maior ou igual a 1            |
| `ItemPedido` | `precoUnitario` | Maior que zero                        |
| `Pedido`     | `itens`         | Array com pelo menos 1 item           |

---

## 📐 Padrões de Projeto

```mermaid
mindmap
  root(("🏛️ Padrões Aplicados"))
    Factory Method
      Categoria.criar / fromDB / editar
      Produto.criar / fromDB / editar
      Cliente.criar / fromDB / editar
      Vendedor.criar / fromDB / editar
      Pedido.criar / fromDB
      ItemPedido.criar / fromDB / comPedido
    Repository Pattern
      CategoriaRepository
      ProdutoRepository
      ClienteRepository
      VendedorRepository
      PedidoRepository
      Transação Atômica
    Singleton
      db.connection.ts
      Pool único de conexão
    Layered Architecture
      Controller
      Service
      Repository
      Model
    OOP
      Herança
        Pessoa → Cliente
        Pessoa → Vendedor
      Abstração
        Pessoa abstract
        getTipo abstract
        exibirDetalhes abstract
      Encapsulamento
        Atributos private
        Getters e Setters
        Validações privadas
      Polimorfismo
        getTipo por subclasse
        exibirDetalhes por subclasse
```

| Padrão                   | Onde é Aplicado                                                     | Benefício                                                                      |
| ------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Factory Method**       | Métodos estáticos `criar`, `fromDB`, `editar` em todas as entidades | Controla criação de objetos, centraliza validações, evita instâncias inválidas |
| **Repository Pattern**   | `*Repository` — um por entidade                                     | Isola o SQL, torna o Service agnóstico ao banco, facilita manutenção           |
| **Singleton**            | `db.connection.ts` — pool de conexão único                          | Evita múltiplas conexões abertas, otimiza uso de recursos                      |
| **Layered Architecture** | Toda a estrutura do projeto                                         | Separação clara de responsabilidades e manutenibilidade                        |
| **Herança e Abstração**  | `Pessoa (abstract)` → `Cliente`, `Vendedor`                         | Reutilização de código e validações compartilhadas                             |

---

## 🛠️ Tecnologias

### Dependências de Produção

<div align="center">

![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL2](https://img.shields.io/badge/mysql2-3.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-latest-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![Multer](https://img.shields.io/badge/Multer-latest-FF6C37?style=for-the-badge)

</div>

### Dependências de Desenvolvimento

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![ts-node](https://img.shields.io/badge/ts--node-10.x-3178C6?style=for-the-badge&logo=ts-node&logoColor=white)
![nodemon](https://img.shields.io/badge/nodemon-3.x-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)

</div>

```mermaid
graph LR
    subgraph Prod["📦 Produção"]
        E["Express\nFramework HTTP"]
        M["mysql2\nDriver MySQL + Pool"]
        D["dotenv\nVariáveis de Ambiente"]
        MU["Multer\nUpload de Arquivos"]
    end

    subgraph Dev["🔧 Desenvolvimento"]
        TS["TypeScript\nLinguagem"]
        TN["ts-node\nExecutor TS"]
        NM["nodemon\nLive Reload"]
        TE["@types/express\nTipagens"]
        TND["@types/node\nTipagens"]
        TM["@types/multer\nTipagens"]
    end

    App(["🚀 Aplicação"]) --> Prod
    App --> Dev
```

---

## 🔍 Qualidade de Código

O projeto foi analisado e aprovado pelo **SonarQube** sem nenhuma issue crítica ou bloqueante.

<div align="center">

![Quality Gate](https://img.shields.io/badge/Quality%20Gate-Aprovado-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white)
![Bugs](https://img.shields.io/badge/Bugs-0-brightgreen?style=for-the-badge&logo=sonarqube&logoColor=white)
![Code Smells](https://img.shields.io/badge/Code%20Smells-0-brightgreen?style=for-the-badge&logo=sonarqube&logoColor=white)
![Vulnerabilities](https://img.shields.io/badge/Vulnerabilities-0-brightgreen?style=for-the-badge&logo=sonarqube&logoColor=white)
![Duplications](https://img.shields.io/badge/Duplicações-5%25-brightgreen?style=for-the-badge&logo=sonarqube&logoColor=white)

</div>

O projeto utiliza o **SonarLint** (plugin SonarQube para VS Code) para análise estática em tempo real. As verificações incluem detecção de Code Smells, vulnerabilidades de segurança (incluindo SQL Injection), complexidade ciclomática e duplicação de código.

```mermaid
flowchart LR
    Code["💻 Código TypeScript"] --> SL["🔍 SonarLint\n(VS Code Plugin)"]
    SL --> R1["✅ Sem Bugs"]
    SL --> R2["✅ Sem Vulnerabilidades"]
    SL --> R3["✅ Sem Code Smells"]
    SL --> R4["✅ 0% Duplicações"]
    R1 & R2 & R3 & R4 --> QG(["🏆 Quality Gate\nAprovado"])
```

---

### Pré-requisitos

- Node.js (LTS)
- MySQL 8+
- npm

### Variáveis de Ambiente

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sales_order
PORT=8000
```

### Testes com Insomnia

Importe o arquivo `docs/insomnia.json` no Insomnia via **File → Import → From File** e siga a ordem recomendada:

```mermaid
flowchart LR
    A(["1️⃣ Categoria\nCriar categoria"]) -->
    B(["2️⃣ Produto\nCriar produto\n+ upload imagem"]) -->
    C(["3️⃣ Cliente\nCriar cliente"]) -->
    D(["4️⃣ Vendedor\nCriar vendedor"]) -->
    E(["5️⃣ Pedido\nCriar pedido\ncom itens"])
```

> ⚠️ Siga essa ordem para evitar erros de chave estrangeira (FK).

---

<div align="center">
  <sub>Projeto Acadêmico Backend SENAI — TypeScript · Express · MySQL2 · OOP · Design Patterns</sub>
</div>
