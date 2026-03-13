import { RowDataPacket } from "mysql2";

export interface IItemPedido extends RowDataPacket {
  id_item:        number;
  id_pedido:      number;
  id_produto:     number;
  quantidade:     number;
  preco_unitario: number;
}

export class ItemPedido {
  private readonly _id:           number | null;
  private readonly _pedidoId:     number | null;
  private _produtoId:             number;
  private _quantidade:            number;
  private _precoUnitario:         number;

  /**
   * @param id             ID do banco (null quando não persistido)
   * @param pedidoId       FK do pedido (null antes do pedido ser salvo)
   * @param produtoId      FK do produto
   * @param quantidade     Quantidade do item (>= 1)
   * @param precoUnitario  Preço no momento da venda (> 0)
   */
  constructor(
    id:            number | null,
    pedidoId:      number | null,
    produtoId:     number,
    quantidade:    number,
    precoUnitario: number
  ) {
    this._id            = id;
    this._pedidoId      = pedidoId;
    this._produtoId     = produtoId;
    this._quantidade    = this.validarQuantidade(quantidade);
    this._precoUnitario = this.validarPreco(precoUnitario);
  }

  // Getters

  get Id():            number | null { return this._id; }
  get PedidoId():      number | null { return this._pedidoId; }
  get ProdutoId():     number        { return this._produtoId; }
  get Quantidade():    number        { return this._quantidade; }
  get PrecoUnitario(): number        { return this._precoUnitario; }

  /** Subtotal deste item (quantidade * preço unitário) */
  get Subtotal(): number {
    return this._quantidade * this._precoUnitario;
  }

  // Setters

  set Quantidade(valor: number)    { this._quantidade    = this.validarQuantidade(valor); }
  set PrecoUnitario(valor: number) { this._precoUnitario = this.validarPreco(valor); }

  // Static Factory Methods

  /**
   * Fábrica: cria um ItemPedido novo (sem ID, sem pedidoId ainda).
   * O pedidoId será vinculado após o Pedido ser persistido.
   */
  static criar(
    produtoId:     number,
    quantidade:    number,
    precoUnitario: number
  ): ItemPedido {
    return new ItemPedido(null, null, produtoId, quantidade, precoUnitario);
  }

  /**
   * Fábrica: reconstrói um ItemPedido a partir de uma linha do banco.
   */
  static fromDB(row: IItemPedido): ItemPedido {
    return new ItemPedido(
      row.id_item,
      row.id_pedido,
      row.id_produto,
      row.quantidade,
      row.preco_unitario
    );
  }

  /**
   * Fábrica: cria instância vinculada a um pedido já persistido.
   * @param pedidoId ID do pedido recém-criado no banco
   */
  static comPedido(
    pedidoId:      number,
    produtoId:     number,
    quantidade:    number,
    precoUnitario: number
  ): ItemPedido {
    return new ItemPedido(null, pedidoId, produtoId, quantidade, precoUnitario);
  }

  // Validações Privadas

  private validarQuantidade(quantidade: number): number {
    if (!Number.isInteger(quantidade) || quantidade < 1) {
      throw new Error("Quantidade deve ser um número inteiro maior ou igual a 1.");
    }
    return quantidade;
  }

  private validarPreco(preco: number): number {
    if (preco <= 0) {
      throw new Error("Preço unitário deve ser maior que zero.");
    }
    return preco;
  }
}