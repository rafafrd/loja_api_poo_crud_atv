### Diagrama Entidade-Relacionamento (ERD)

```mermaid
erDiagram
    CATEGORIAS ||--o{ PRODUTOS : "possui"
    CLIENTES ||--o{ PEDIDOS : "realiza"
    VENDEDORES ||--o{ PEDIDOS : "atende"
    PEDIDOS ||--|{ ITENSPEDIDOS : "contem"
    PRODUTOS ||--o{ ITENSPEDIDOS : "listado_em"

    CATEGORIAS {
        int id_categoria PK
        string nome
    }
    PRODUTOS {
        int id_produto PK
        string nome
        decimal preco
        int id_categoria FK
        string vinculo_imagem
    }
    CLIENTES {
        int id_cliente PK
        string nome
        string email
    }
    VENDEDORES {
        int id_vendedor PK
        string nome
    }
    PEDIDOS {
        int id_pedido PK
        datetime data_pedido
        int id_cliente FK
        int id_vendedor FK
        int valor_final
    }
    ITENSPEDIDOS {
        int id_item PK
        int quantidade
        decimal preco_unitario
        int id_pedido FK
        int id_produto FK
    }

```

### Relacionamentos

- **1 Categoria** pode ter **N Produtos** (1:N).
- **1 Cliente** pode fazer **N Pedidos** (1:N).
- **1 Vendedor** pode atender **N Pedidos** (1:N).
- **1 Pedido** pode ter **N ItensPedidos** (1:N).
- **1 Produto** pode aparecer em **N ItensPedidos** (1:N).
