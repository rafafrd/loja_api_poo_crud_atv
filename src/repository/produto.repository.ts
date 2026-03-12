import { ResultSetHeader } from "mysql2";
import {db} from "../database/db.connection";
import { Produto, IProduto } from "../models/produto.model";

// ============================================================
// Repository — Produto
// ============================================================
export class ProdutoRepository {

  /**
   * Busca todos os produtos (com nome da categoria via JOIN).
   * @returns Lista de instâncias ricas de Produto
   */
  async findAll(): Promise<Produto[]> {
    const [rows] = await db.query<IProduto[]>(
      `SELECT id_produto, nome, preco, id_categoria, vinculo_imagem
       FROM produtos`
    );
    return rows.map(Produto.fromDB);
  }

  /**
   * Busca um produto pelo ID.
   * @param id ID do produto
   * @returns Instância de Produto ou null
   */
  async findById(id: number): Promise<Produto | null> {
    const [rows] = await db.query<IProduto[]>(
      `SELECT id_produto, nome, preco, id_categoria, vinculo_imagem
       FROM produtos WHERE id_produto = ?`,
      [id]
    );
    if (rows.length === 0) return null;
    return Produto.fromDB(rows[0]);
  }

  /**
   * Busca todos os produtos de uma categoria.
   * @param categoriaId FK da categoria
   */
  async findByCategoria(categoriaId: number): Promise<Produto[]> {
    const [rows] = await db.query<IProduto[]>(
      `SELECT id_produto, nome, preco, id_categoria, vinculo_imagem
       FROM produtos WHERE id_categoria = ?`,
      [categoriaId]
    );
    return rows.map(Produto.fromDB);
  }

  /**
   * Persiste um novo Produto no banco.
   * @param produto Instância criada pela Factory
   */
  async create(produto: Produto): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO produtos (nome, preco, id_categoria, vinculo_imagem)
       VALUES (?, ?, ?, ?)`,
      [produto.Nome, produto.Preco, produto.CategoriaId, produto.VincutoImagem]
    );
    return result;
  }

  /**
   * Atualiza um Produto existente.
   * @param produto Instância editada pela Factory
   */
  async update(produto: Produto): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE produtos
       SET nome = ?, preco = ?, id_categoria = ?, vinculo_imagem = ?
       WHERE id_produto = ?`,
      [produto.Nome, produto.Preco, produto.CategoriaId, produto.VincutoImagem, produto.Id]
    );
    return result;
  }

  /**
   * Remove um Produto pelo ID.
   * @param id ID do produto
   */
  async delete(id: number): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM produtos WHERE id_produto = ?",
      [id]
    );
    return result;
  }
}