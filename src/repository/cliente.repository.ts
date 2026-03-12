import { ResultSetHeader } from "mysql2";
import {db}                  from "../database/db.connection";
import { Cliente, ICliente } from "../models/cliente.model";

// Repository — Cliente
export class ClienteRepository {

  /** Busca todos os clientes. */
  async findAll(): Promise<Cliente[]> {
    const [rows] = await db.query<ICliente[]>(
      "SELECT id_cliente, nome, email FROM clientes"
    );
    return rows.map(Cliente.fromDB);
  }

  /**
   * Busca um cliente pelo ID.
   * @param id ID do cliente
   */
  async findById(id: number): Promise<Cliente | null> {
    const [rows] = await db.query<ICliente[]>(
      "SELECT id_cliente, nome, email FROM clientes WHERE id_cliente = ?",
      [id]
    );
    if (rows.length === 0) return null;
    return Cliente.fromDB(rows[0]);
  }

  /**
   * Persiste um novo Cliente.
   * @param cliente Instância criada pela Factory
   */
  async create(cliente: Cliente): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO clientes (nome, email) VALUES (?, ?)",
      [cliente.Nome, cliente.Email]
    );
    return result;
  }

  /**
   * Atualiza um Cliente existente.
   * @param cliente Instância editada pela Factory
   */
  async update(cliente: Cliente): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE clientes SET nome = ?, email = ? WHERE id_cliente = ?",
      [cliente.Nome, cliente.Email, cliente.Id]
    );
    return result;
  }

  /**
   * Remove um Cliente pelo ID.
   * @param id ID do cliente
   */
  async delete(id: number): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM clientes WHERE id_cliente = ?",
      [id]
    );
    return result;
  }
}