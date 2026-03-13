import { ResultSetHeader } from "mysql2";
import {db}                  from "../database/db.connection";
import { Pedido, IPedido }         from "../models/pedido.model";
import { ItemPedido, IItemPedido } from "../models/itemPedido.model";

// ============================================================
// Repository — Pedido
// Gerencia Pedido e ItensPedidos em transação única
// ============================================================
export class PedidoRepository {

  /**
   * Busca todos os pedidos com seus itens (JOIN).
   * @returns Lista de instâncias ricas de Pedido
   */
  async findAll(): Promise<Pedido[]> {
    const [pedidoRows] = await db.query<IPedido[]>(
      `SELECT id_pedido, data_pedido, id_cliente, id_vendedor, valor_final
       FROM pedidos`
    );

    // Para cada pedido, busca seus itens
    const pedidos = await Promise.all(
      pedidoRows.map(async (row) => {
        const itens = await this.findItensByPedidoId(row.id_pedido);
        return Pedido.fromDB(row, itens);
      })
    );

    return pedidos;
  }

  /**
   * Busca um pedido pelo ID com seus itens embutidos.
   * @param id ID do pedido
   * @returns Instância de Pedido ou null
   */
  async findById(id: number): Promise<Pedido | null> {
    const [rows] = await db.query<IPedido[]>(
      `SELECT id_pedido, data_pedido, id_cliente, id_vendedor, valor_final
       FROM pedidos WHERE id_pedido = ?`,
      [id]
    );
    if (rows.length === 0) return null;

    const itens = await this.findItensByPedidoId(id);
    return Pedido.fromDB(rows[0], itens);
  }

  /**
   * Busca os itens de um pedido específico.
   * Método auxiliar interno do repository.
   * @param pedidoId ID do pedido
   */
  async findItensByPedidoId(pedidoId: number): Promise<ItemPedido[]> {
    const [rows] = await db.query<IItemPedido[]>(
      `SELECT id_item, id_pedido, id_produto, quantidade, preco_unitario
       FROM itenspedidos WHERE id_pedido = ?`,
      [pedidoId]
    );
    return rows.map(ItemPedido.fromDB);
  }

  /**
   * Persiste um Pedido e seus itens em uma transação atômica.
   * Se qualquer INSERT falhar, tudo é revertido (ROLLBACK).
   * @param pedido Instância criada pela Factory
   * @returns ResultSetHeader do pedido inserido
   */
  async create(pedido: Pedido): Promise<ResultSetHeader> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Insere o Pedido
      const [pedidoResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO pedidos (id_cliente, id_vendedor, valor_final, data_pedido)
         VALUES (?, ?, ?, ?)`,
        [pedido.ClienteId, pedido.VendedorId, pedido.ValorFinal, pedido.DataPedido]
      );

      const pedidoId = pedidoResult.insertId;

      // 2. Insere cada ItemPedido vinculado ao pedido recém-criado
      for (const item of pedido.Itens) {
        await connection.query<ResultSetHeader>(
          `INSERT INTO itenspedidos (id_pedido, id_produto, quantidade, preco_unitario)
           VALUES (?, ?, ?, ?)`,
          [pedidoId, item.ProdutoId, item.Quantidade, item.PrecoUnitario]
        );
      }

      await connection.commit();
      return pedidoResult;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Remove um Pedido e seus itens (CASCADE via FK ou delete manual).
   * @param id ID do pedido
   */
  async delete(id: number): Promise<ResultSetHeader> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Remove os itens antes (respeita FK)
      await connection.query(
        "DELETE FROM itenspedidos WHERE id_pedido = ?",
        [id]
      );

      // 2. Remove o pedido
      const [result] = await connection.query<ResultSetHeader>(
        "DELETE FROM pedidos WHERE id_pedido = ?",
        [id]
      );

      await connection.commit();
      return result;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}