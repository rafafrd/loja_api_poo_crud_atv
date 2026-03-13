POST /pedidos
body: { clienteId, vendedorId, itens: [{ produtoId, quantidade }] }
↓
Controller valida tipos
↓
Service recebe itensInput[]
↓
Para cada item → ProdutoService.buscarPorId(produtoId) → pega o preco atual
↓
ItemPedido.criar(produtoId, quantidade, produto.Preco)
↓
Pedido.criar(...) → calcularTotal() automático
↓
Repository → transação atômica
