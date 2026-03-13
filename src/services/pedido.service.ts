import { Pedido }            from "../models/pedido.model";
import { ItemPedido }        from "../models/itemPedido.model";
import { PedidoRepository }  from "../repository/pedido.repository";

export interface IItemInput {
  produtoId:     number;
  quantidade:    number;
  precoUnitario: number;
}

export class PedidoService {
  private readonly _repository: PedidoRepository;

  constructor() {
    this._repository = new PedidoRepository();
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
   * Cria um Pedido completo com seus itens.
   * O valor_final é calculado automaticamente pelo objeto Pedido.
   *
   * @param clienteId  FK do cliente
   * @param vendedorId FK do vendedor
   * @param itensInput Array de itens vindos do body da requisição
   */
  async criar(
    clienteId:  number,
    vendedorId: number,
    itensInput: IItemInput[]
  ): Promise<Pedido> {
    if (!itensInput || itensInput.length === 0) {
      throw new Error("O pedido deve conter pelo menos um item.");
    }

    // Factory de cada ItemPedido — objetos já nascem validados
    const itens: ItemPedido[] = itensInput.map((i) =>
      ItemPedido.criar(i.produtoId, i.quantidade, i.precoUnitario)
    );

    // Factory do Pedido — calcularTotal() chamado no construtor
    const novoPedido = Pedido.criar(clienteId, vendedorId, itens);

    const resultado = await this._repository.create(novoPedido);

    // Retorna o pedido completo buscando do banco (com IDs gerados)
    return await this.buscarPorId(resultado.insertId);
  }

  /**
   * Remove um pedido pelo ID.
   * @param id ID do pedido
   */
  async deletar(id: number): Promise<void> {
    await this.buscarPorId(id); // garante que existe
    await this._repository.delete(id);
  }
}