import { RowDataPacket } from "mysql2";
import { Pessoa }        from "./pessoa.model";

export interface IVendedor extends RowDataPacket {
  id_vendedor: number;
  nome:        string;
}

//(herda de Pessoa)
export class Vendedor extends Pessoa {

  /**
   * @param id   ID do banco (null quando não persistido)
   * @param nome Nome do vendedor
   */
  constructor(id: number | null, nome: string) {
    super(id, nome);
  }

  // Implementação dos Métodos Abstratos (Polimorfismo)

  /** Retorna o tipo desta entidade. */
  getTipo(): string {
    return "Vendedor";
  }

  /**
   * Exibe os detalhes do vendedor no console.
   * Sobrescreve o método abstrato de Pessoa.
   */
  exibirDetalhes(): void {
    console.log(`[Vendedor] ID: ${this.Id} | Nome: ${this.Nome}`);
  }

  // Static Factory Methods

  /** Fábrica: cria um Vendedor novo (sem ID). */
  static criar(nome: string): Vendedor {
    return new Vendedor(null, nome);
  }

  /** Fábrica: reconstrói um Vendedor a partir de uma linha do banco. */
  static fromDB(row: IVendedor): Vendedor {
    return new Vendedor(row.id_vendedor, row.nome);
  }

  /** Fábrica: cria instância para operação de edição. */
  static editar(id: number, nome: string): Vendedor {
    return new Vendedor(id, nome);
  }
}