import { RowDataPacket } from "mysql2";
import { Pessoa }        from "./pessoa.model";

// Interface de Mapeamento — Cliente
export interface ICliente extends RowDataPacket {
  id_cliente: number;
  nome:       string;
  email:      string;
}

// Classe de Entidade Rica — Cliente (herda de Pessoa)
export class Cliente extends Pessoa {
  private _email: string;

  /**
   * @param id    ID do banco (null quando não persistido)
   * @param nome  Nome do cliente
   * @param email E-mail do cliente
   */
  constructor(id: number | null, nome: string, email: string) {
    super(id, nome);
    this._email = this.validarEmail(email);
  }

  // Getters

  get Email(): string { return this._email; }

  // Setters

  set Email(valor: string) { this._email = this.validarEmail(valor); }

  // Implementação dos Métodos Abstratos (Polimorfismo)

  /** Retorna o tipo desta entidade. */
  getTipo(): string {
    return "Cliente";
  }

  /**
   * Exibe os detalhes do cliente no console.
   * Sobrescreve o método abstrato de Pessoa.
   */
  exibirDetalhes(): void {
    console.log(`[Cliente] ID: ${this.Id} | Nome: ${this.Nome} | E-mail: ${this._email}`);
  }

  // Static Factory Methods

  /**
   * Fábrica: cria um Cliente novo (sem ID).
   */
  static criar(nome: string, email: string): Cliente {
    return new Cliente(null, nome, email);
  }

  /**
   * Fábrica: reconstrói um Cliente a partir de uma linha do banco.
   */
  static fromDB(row: ICliente): Cliente {
    return new Cliente(row.id_cliente, row.nome, row.email);
  }

  /**
   * Fábrica: cria instância para operação de edição.
   */
  static editar(id: number, nome: string, email: string): Cliente {
    return new Cliente(id, nome, email);
  }

  // Validações Privadas

  private validarEmail(email: string): string {
    const sanitizado = email?.trim().toLowerCase();
    const regex      = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizado || !regex.test(sanitizado)) {
      throw new Error("E-mail inválido.");
    }
    return sanitizado;
  }
}