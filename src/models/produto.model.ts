import { RowDataPacket } from "mysql2";

// Interface de Mapeamento (Banco de Dados)
export interface IProduto extends RowDataPacket {
  id_produto:     number;
  nome:           string;
  preco:          number;
  id_categoria:   number;
  vinculo_imagem: string | null;
}

// Classe de Entidade Rica — Produto
export class Produto {
  private readonly _id:    number | null;
  private _nome:           string;
  private _preco:          number;
  private _categoriaId:    number;
  private _vincutoImagem:  string | null;

  // Construtor
  /**
   * @param id            ID do banco (null quando não persistido)
   * @param nome          Nome do produto
   * @param preco         Preço unitário (> 0)
   * @param categoriaId   FK da categoria
   * @param vincutoImagem Caminho do arquivo salvo pelo Multer
   */
  constructor(
    id:            number | null,
    nome:          string,
    preco:         number,
    categoriaId:   number,
    vincutoImagem: string | null = null
  ) {
    this._id           = id;
    this._nome         = this.validarNome(nome);
    this._preco        = this.validarPreco(preco);
    this._categoriaId  = categoriaId;
    this._vincutoImagem = vincutoImagem;
  }

  // Getters

  get Id():            number | null { return this._id; }
  get Nome():          string        { return this._nome; }
  get Preco():         number        { return this._preco; }
  get CategoriaId():   number        { return this._categoriaId; }
  get VincutoImagem(): string | null { return this._vincutoImagem; }

  // Setters

  set Nome(valor: string)         { this._nome  = this.validarNome(valor); }
  set Preco(valor: number)        { this._preco = this.validarPreco(valor); }
  set CategoriaId(valor: number)  { this._categoriaId  = valor; }
  set VincutoImagem(valor: string | null) { this._vincutoImagem = valor; }

  // Static Factory Methods

  /**
   * Fábrica: cria um Produto novo (sem ID).
   */
  static criar(
    nome:          string,
    preco:         number,
    categoriaId:   number,
    vincutoImagem: string | null = null
  ): Produto {
    return new Produto(null, nome, preco, categoriaId, vincutoImagem);
  }

  /**
   * Fábrica: reconstrói um Produto a partir de uma linha do banco.
   */
  static fromDB(row: IProduto): Produto {
    return new Produto(
      row.id_produto,
      row.nome,
      row.preco,
      row.id_categoria,
      row.vinculo_imagem
    );
  }

  /**
   * Fábrica: cria instância para operação de edição.
   */
  static editar(
    id:            number,
    nome:          string,
    preco:         number,
    categoriaId:   number,
    vincutoImagem: string | null = null
  ): Produto {
    return new Produto(id, nome, preco, categoriaId, vincutoImagem);
  }

  // Validações Privadas

  private validarNome(nome: string): string {
    const sanitizado = nome?.trim();
    if (!sanitizado || sanitizado.length < 3) {
      throw new Error("Nome do produto deve ter pelo menos 3 caracteres.");
    }
    return sanitizado;
  }

  private validarPreco(preco: number): number {
    if (preco <= 0) {
      throw new Error("Preço do produto deve ser maior que zero.");
    }
    return preco;
  }
}