import { RowDataPacket } from "mysql2";
export interface ICategoria extends RowDataPacket {
  id_categoria: number;
  nome: string;
}

export class Categoria {
  private readonly _id: number | null; // n muda

  /** Nome da categoria — mutável via setter com validação */
  private _nome: string;

  /**
   * Inicializa a entidade Categoria com estado válido.
   * @param id   ID do banco (null quando ainda não persistido)
   * @param nome Nome da categoria
   */
  constructor(id: number | null, nome: string) {
    this._id   = id;
    this._nome = this.validarNome(nome);
  }

  // Getters

  get Id(): number | null {
    return this._id;
  }

  get Nome(): string {
    return this._nome;
  }

  // Setters
  /**
   * Atualiza o nome da categoria após validação.
   * @param valor Novo nome
   */
  set Nome(valor: string) {
    this._nome = this.validarNome(valor);
  }

  // Static Factory Methods

  /**
   * Fábrica: cria uma Categoria nova (sem ID — ainda não persistida).
   * @param nome Nome da categoria
   */
  static criar(nome: string): Categoria {
    return new Categoria(null, nome);
  }

  /**
   * Fábrica: reconstrói uma Categoria a partir de dados do banco.
   * @param row Linha crua retornada pelo MySQL
   */
  static fromDB(row: ICategoria): Categoria {
    return new Categoria(row.id_categoria, row.nome);
  }

  /**
   * Fábrica: cria uma instância para operação de edição.
   * @param id   ID existente no banco
   * @param nome Nome atualizado
   */
  static editar(id: number, nome: string): Categoria {
    return new Categoria(id, nome);
  }

  // Validações Privadas (regras de negócio da entidade)

  /**
   * Valida o nome da categoria.
   * @param nome Nome a validar
   * @returns Nome sanitizado
   * @throws Error se o nome for inválido
   */
  private validarNome(nome: string): string {
    const sanitizado = nome?.trim();
    if (!sanitizado || sanitizado.length < 3) {
      throw new Error("Nome da categoria deve ter pelo menos 3 caracteres.");
    }
    return sanitizado;
  }
}