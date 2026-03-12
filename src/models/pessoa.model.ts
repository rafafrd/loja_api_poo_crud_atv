import { RowDataPacket } from "mysql2";

export interface IPessoa extends RowDataPacket {
  id:   number;
  nome: string;
}

//  (Herança)
export abstract class Pessoa {
  private readonly _id:  number | null;
  private _nome:         string;

  /**
   * @param id   ID do banco (null quando não persistido)
   * @param nome Nome da pessoa
   */
  constructor(id: number | null, nome: string) {
    this._id   = id;
    this._nome = this.validarNome(nome);
  }

  // Getters

  get Id():   number | null { return this._id; }
  get Nome(): string        { return this._nome; }

  // Setters

  set Nome(valor: string) { this._nome = this.validarNome(valor); }

  // Métodos Abstratos (Polimorfismo por Sobrescrita)

  /**
   * Retorna o tipo da pessoa ("Cliente" ou "Vendedor").
   * Cada subclasse implementa com seu próprio valor.
   */
  abstract getTipo(): string;

  /**
   * Exibe os detalhes da pessoa no console.
   * Cada subclasse implementa com seus próprios campos.
   */
  abstract exibirDetalhes(): void;

  // Validações Privadas

  private validarNome(nome: string): string {
    const sanitizado = nome?.trim();
    if (!sanitizado || sanitizado.length < 3) {
      throw new Error("Nome deve ter pelo menos 3 caracteres.");
    }
    return sanitizado;
  }
}