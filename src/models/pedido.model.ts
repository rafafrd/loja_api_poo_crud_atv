import { RowDataPacket } from "mysql2";
import { ItemPedido }    from "./itemPedido.model";

export interface IPedido extends RowDataPacket {
  id_pedido:   number;
  data_pedido: Date;
  id_cliente:  number;
  id_vendedor: number;
  valor_final: number;
}

export class Pedido {
  private readonly _id:         number | null;
  private readonly _dataPedido: Date;
  private _clienteId:           number;
  private _vendedorId:          number;
  private _itens:               ItemPedido[];
  private _valorFinal:          number;

  /**
   * @param id          ID do banco (null quando não persistido)
   * @param clienteId   FK do cliente
   * @param vendedorId  FK do vendedor
   * @param itens       Lista de itens do pedido
   * @param dataPedido  Data do pedido (default: agora)
   */
  constructor(
    id:          number | null,
    clienteId:   number,
    vendedorId:  number,
    itens:       ItemPedido[] = [],
    dataPedido:  Date = new Date()
  ) {
    this._id          = id;
    this._clienteId   = clienteId;
    this._vendedorId  = vendedorId;
    this._dataPedido  = dataPedido;
    this._itens       = itens;
    this._valorFinal  = this.calcularTotal();
  }

  // Getters

  get Id():          number | null { return this._id; }
  get ClienteId():   number        { return this._clienteId; }
  get VendedorId():  number        { return this._vendedorId; }
  get DataPedido():  Date          { return this._dataPedido; }
  get Itens():       ItemPedido[]  { return this._itens; }
  get ValorFinal():  number        { return this._valorFinal; }

  // Regra de Negócio — Interação entre Objetos

  /**
   * Itera sobre os itens e soma os subtotais.
   * Atualiza o estado interno `_valorFinal`.
   * Demonstra coesão: o próprio Pedido sabe calcular seu total.
   * @returns Total calculado
   */
  calcularTotal(): number {
    this._valorFinal = this._itens.reduce(
      (total, item) => total + item.Subtotal,
      0
    );
    return this._valorFinal;
  }

  /**
   * Adiciona um item ao pedido e recalcula o total.
   * @param item Instância de ItemPedido
   */
  adicionarItem(item: ItemPedido): void {
    this._itens.push(item);
    this.calcularTotal();
  }

  // Static Factory Methods

  /**
   * Fábrica: cria um Pedido novo com seus itens.
   * O total é calculado automaticamente no construtor.
   */
  static criar(
    clienteId:  number,
    vendedorId: number,
    itens:      ItemPedido[]
  ): Pedido {
    return new Pedido(null, clienteId, vendedorId, itens);
  }

  /**
   * Fábrica: reconstrói um Pedido a partir de uma linha do banco.
   * Os itens são injetados após a query de JOIN.
   */
  static fromDB(row: IPedido, itens: ItemPedido[] = []): Pedido {
    return new Pedido(
      row.id_pedido,
      row.id_cliente,
      row.id_vendedor,
      itens,
      new Date(row.data_pedido)
    );
  }
}