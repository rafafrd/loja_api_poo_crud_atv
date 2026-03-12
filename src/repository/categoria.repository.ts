import { ResultSetHeader } from "mysql2";
import {db} from "../database/db.connection";
import { Categoria, ICategoria } from "../models/categoria.model";

// ============================================================
// Repository — Categoria
// Fronteira entre a lógica de negócio e o banco de dados
// ============================================================
export class CategoriaRepository {

  /**
   * Busca todas as categorias no banco.
   * @returns Lista de instâncias ricas de Categoria
   */
  async findAll(): Promise<Categoria[]> {
    const [rows] = await db.query<ICategoria[]>(
      "SELECT id_categoria, nome FROM categorias"
    );
    return rows.map(Categoria.fromDB);
  }

  /**
   * Busca uma categoria pelo ID.
   * @param id ID da categoria
   * @returns Instância de Categoria ou null se não encontrada
   */
  async findById(id: number): Promise<Categoria | null> {
    const [rows] = await db.query<ICategoria[]>(
      "SELECT id_categoria, nome FROM categorias WHERE id_categoria = ?",
      [id]
    );
    if (rows.length === 0) return null;
    return Categoria.fromDB(rows[0]);
  }

  /**
   * Persiste uma nova Categoria no banco.
   * @param categoria Instância criada pela Factory
   * @returns ResultSetHeader com insertId e affectedRows
   */
  async create(categoria: Categoria): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO categorias (nome) VALUES (?)",
      [categoria.Nome]
    );
    return result;
  }

  /**
   * Atualiza uma Categoria existente pelo ID.
   * @param categoria Instância editada pela Factory
   * @returns ResultSetHeader com affectedRows
   */
  async update(categoria: Categoria): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE categorias SET nome = ? WHERE id_categoria = ?",
      [categoria.Nome, categoria.Id]
    );
    return result;
  }

  /**
   * Remove uma Categoria pelo ID.
   * @param id ID da categoria a remover
   * @returns ResultSetHeader com affectedRows
   */
  async delete(id: number): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM categorias WHERE id_categoria = ?",
      [id]
    );
    return result;
  }
}