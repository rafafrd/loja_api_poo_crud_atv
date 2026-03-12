import { ResultSetHeader } from "mysql2";
import {db}                  from "../database/db.connection";
import { Vendedor, IVendedor } from "../models/vendedor.model";

// Repository — Vendedor
export class VendedorRepository {

  /** Busca todos os vendedores. */
  async findAll(): Promise<Vendedor[]> {
    const [rows] = await db.query<IVendedor[]>(
      "SELECT id_vendedor, nome FROM vendedores"
    );
    return rows.map(Vendedor.fromDB);
  }

  /**
   * Busca um vendedor pelo ID.
   * @param id ID do vendedor
   */
  async findById(id: number): Promise<Vendedor | null> {
    const [rows] = await db.query<IVendedor[]>(
      "SELECT id_vendedor, nome FROM vendedores WHERE id_vendedor = ?",
      [id]
    );
    if (rows.length === 0) return null;
    return Vendedor.fromDB(rows[0]);
  }

  /**
   * Persiste um novo Vendedor.
   * @param vendedor Instância criada pela Factory
   */
  async create(vendedor: Vendedor): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO vendedores (nome) VALUES (?)",
      [vendedor.Nome]
    );
    return result;
  }

  /**
   * Atualiza um Vendedor existente.
   * @param vendedor Instância editada pela Factory
   */
  async update(vendedor: Vendedor): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE vendedores SET nome = ? WHERE id_vendedor = ?",
      [vendedor.Nome, vendedor.Id]
    );
    return result;
  }

  /**
   * Remove um Vendedor pelo ID.
   * @param id ID do vendedor
   */
  async delete(id: number): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM vendedores WHERE id_vendedor = ?",
      [id]
    );
    return result;
  }
}