import { Pedido }           from "../models/pedido.model";
import { ItemPedido }       from "../models/itemPedido.model";
import { PedidoRepository } from "../repository/pedido.repository";
import { ProdutoService }   from "./produto.service";

export interface IItemInput {
  produtoId:  number;
  quantidade: number;
}

export class PedidoService {
  private readonly _repository:     PedidoRepository;
  private readonly _produtoService: ProdutoService;

  constructor() {
    this._repository     = new PedidoRepository();
    this._produtoService = new ProdutoService();
  }

  /** Retorna todos os pedidos com itens embutidos. */
  async listarTodos(): Promise<Pedido[]> {
    return await this._repository.findAll();
  }

  /**
   * Retorna um pedido pelo ID com itens embutidos.
   * @throws Error se não encontrado
   */
  async buscarPorId(id: number): Promise<Pedido> {
    const pedido = await this._repository.findById(id);
    if (!pedido) throw new Error(`Pedido com ID ${id} não encontrado.`);
    return pedido;
  }

  /**
   * Cria um Pedido completo buscando o preço de cada produto no banco.
   * O valor_final é calculado automaticamente pelo objeto Pedido.
   *
   * @param clienteId  FK do cliente
   * @param vendedorId FK do vendedor
   * @param itensInput Array de { produtoId, quantidade }
   * @throws Error se qualquer produtoId não existir no banco
   */
  async criar(
    clienteId:  number,
    vendedorId: number,
    itensInput: IItemInput[]
  ): Promise<Pedido> {

    // Busca o preço atual de cada produto no banco em paralelo.
    // Se algum produtoId não existir, ProdutoService já lança erro descritivo.
    const itens: ItemPedido[] = await Promise.all(
      itensInput.map(async (i) => {
        const produto = await this._produtoService.buscarPorId(i.produtoId);
        // precoUnitario = preço atual do produto — preserva histórico no item
        return ItemPedido.criar(i.produtoId, i.quantidade, produto.Preco);
      })
    );

    // Factory do Pedido — calcularTotal() chamado automaticamente no construtor
    const novoPedido = Pedido.criar(clienteId, vendedorId, itens);

    const resultado = await this._repository.create(novoPedido);

    // Retorna o pedido completo com IDs gerados pelo banco
    return await this.buscarPorId(resultado.insertId);
  }

  /**
   * Remove um pedido pelo ID.
   * @param id ID do pedido
   */
  async deletar(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this._repository.delete(id);
  }
}