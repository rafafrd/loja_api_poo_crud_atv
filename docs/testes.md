# Testes — API POO

Base URL: `http://localhost:8000`

> **Ordem recomendada:** Siga a sequência abaixo para evitar erros de FK.
> Categoria → Produto → Cliente → Vendedor → Pedido

---

## 📁 Categorias

### GET — Listar todas

- **Método:** `GET`
- **URL:** `/categorias`
- **Body:** nenhum
- **Resposta esperada:** `200 OK` — array de categorias

---

### GET — Buscar por ID

- **Método:** `GET`
- **URL:** `/categorias/1`
- **Body:** nenhum
- **Resposta esperada:** `200 OK` — objeto da categoria
- **Erro esperado:** `404` se ID não existir

---

### POST — Criar

- **Método:** `POST`
- **URL:** `/categorias`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "nome": "Eletrônicos"
}
```

- **Resposta esperada:** `201 Created` — objeto criado com ID
- **Erro esperado:** `400` se nome tiver menos de 3 caracteres

---

### PUT — Editar

- **Método:** `PUT`
- **URL:** `/categorias/1`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "nome": "Eletrônicos e Gadgets"
}
```

- **Resposta esperada:** `200 OK` — objeto atualizado
- **Erro esperado:** `404` se ID não existir

---

### DELETE — Remover

- **Método:** `DELETE`
- **URL:** `/categorias/1`
- **Body:** nenhum
- **Resposta esperada:** `204 No Content`
- **Erro esperado:** `404` se ID não existir

---

## 📁 Produtos

> ⚠️ Requer uma Categoria criada previamente.
> Usar `multipart/form-data` (suporte a upload de imagem).

### GET — Listar todos

- **Método:** `GET`
- **URL:** `/produtos`
- **Body:** nenhum
- **Resposta esperada:** `200 OK` — array de produtos

---

### GET — Buscar por ID

- **Método:** `GET`
- **URL:** `/produtos/1`
- **Body:** nenhum
- **Resposta esperada:** `200 OK` — objeto do produto
- **Erro esperado:** `404` se ID não existir

---

### POST — Criar

- **Método:** `POST`
- **URL:** `/produtos`
- **Body:** `multipart/form-data`

| Campo       | Tipo | Valor exemplo  |
| ----------- | ---- | -------------- |
| nome        | text | Notebook Gamer |
| preco       | text | 4999.90        |
| categoriaId | text | 1              |
| imagem      | file | (opcional)     |

- **Resposta esperada:** `201 Created`
- **Erros esperados:**
  - `400` se nome tiver menos de 3 caracteres
  - `400` se preço for menor ou igual a zero

---

### PUT — Editar

- **Método:** `PUT`
- **URL:** `/produtos/1`
- **Body:** `multipart/form-data` (mesmos campos do POST)
- **Resposta esperada:** `200 OK`
- **Erro esperado:** `404` se ID não existir

---

### DELETE — Remover

- **Método:** `DELETE`
- **URL:** `/produtos/1`
- **Body:** nenhum
- **Resposta esperada:** `204 No Content`
- **Erro esperado:** `404` se ID não existir

---

## 📁 Clientes

### GET — Listar todos

- **Método:** `GET`
- **URL:** `/clientes`
- **Resposta esperada:** `200 OK` — array de clientes

---

### GET — Buscar por ID

- **Método:** `GET`
- **URL:** `/clientes/1`
- **Resposta esperada:** `200 OK`
- **Erro esperado:** `404` se ID não existir

---

### POST — Criar

- **Método:** `POST`
- **URL:** `/clientes`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "nome": "João Silva",
  "email": "joao.silva@email.com"
}
```

- **Resposta esperada:** `201 Created`
- **Erros esperados:**
  - `400` se e-mail for inválido
  - `400` se nome tiver menos de 3 caracteres

---

### PUT — Editar

- **Método:** `PUT`
- **URL:** `/clientes/1`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "nome": "João Silva Santos",
  "email": "joao.santos@email.com"
}
```

- **Resposta esperada:** `200 OK`

---

### DELETE — Remover

- **Método:** `DELETE`
- **URL:** `/clientes/1`
- **Resposta esperada:** `204 No Content`

---

## 📁 Vendedores

### GET — Listar todos

- **Método:** `GET`
- **URL:** `/vendedores`
- **Resposta esperada:** `200 OK`

---

### GET — Buscar por ID

- **Método:** `GET`
- **URL:** `/vendedores/1`
- **Resposta esperada:** `200 OK`
- **Erro esperado:** `404` se ID não existir

---

### POST — Criar

- **Método:** `POST`
- **URL:** `/vendedores`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "nome": "Maria Oliveira"
}
```

- **Resposta esperada:** `201 Created`

---

### PUT — Editar

- **Método:** `PUT`
- **URL:** `/vendedores/1`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "nome": "Maria Oliveira Costa"
}
```

- **Resposta esperada:** `200 OK`

---

### DELETE — Remover

- **Método:** `DELETE`
- **URL:** `/vendedores/1`
- **Resposta esperada:** `204 No Content`

---

## 📁 Pedidos

> ⚠️ Requer Cliente, Vendedor e Produtos criados previamente.
> O `valor_final` é calculado automaticamente — não enviar no body.

### GET — Listar todos

- **Método:** `GET`
- **URL:** `/pedidos`
- **Resposta esperada:** `200 OK` — array de pedidos com itens embutidos

---

### GET — Buscar por ID (com itens)

- **Método:** `GET`
- **URL:** `/pedidos/1`
- **Resposta esperada:** `200 OK` — pedido com array `itens` dentro
- **Erro esperado:** `404` se ID não existir

---

### POST — Criar (com itens)

- **Método:** `POST`
- **URL:** `/pedidos`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "clienteId": 1,
  "vendedorId": 1,
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2,
      "precoUnitario": 4999.9
    },
    {
      "produtoId": 2,
      "quantidade": 1,
      "precoUnitario": 19.9
    }
  ]
}
```

- **Resposta esperada:** `201 Created` — pedido completo com `valor_final: 10019.70`
- **Erros esperados:**
  - `400` se `itens` estiver vazio ou ausente
  - `400` se quantidade for menor que 1
  - `400` se precoUnitario for menor ou igual a zero

---

### DELETE — Remover

- **Método:** `DELETE`
- **URL:** `/pedidos/1`
- **Body:** nenhum
- **Resposta esperada:** `204 No Content`
- **Erro esperado:** `404` se ID não existir

---

## 🔴 Cenários de Erro para Testar

| Cenário                 | Rota              | Esperado |
| ----------------------- | ----------------- | -------- |
| Nome com 2 caracteres   | POST /categorias  | `400`    |
| Preço negativo          | POST /produtos    | `400`    |
| E-mail sem @            | POST /clientes    | `400`    |
| ID inexistente          | GET /pedidos/9999 | `404`    |
| Pedido sem itens        | POST /pedidos     | `400`    |
| Quantidade zero no item | POST /pedidos     | `400`    |
