import { Request, Response } from "express";
import { PedidoService }     from "../services/pedido.service";

// ============================================================
// Controller — Pedido
// ============================================================
export class PedidoController {
  private readonly _service: PedidoService;

  constructor() {
    this._service = new PedidoService();
  }

  /**
   * GET /pedidos
   * Lista todos os pedidos com itens embutidos.
   */
  listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const pedidos = await this._service.listarTodos();
      res.status(200).json(pedidos);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  };

  /**
   * GET /pedidos/:id
   * Retorna um pedido com seus itens.
   */
  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) { res.status(400).json({ mensagem: "ID inválido." }); return; }

      const pedido = await this._service.buscarPorId(id);
      res.status(200).json(pedido);
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };

  /**
   * POST /pedidos
   * Cria um pedido com seus itens em uma única requisição.
   *
   * Body esperado:
   * {
   *   "clienteId":  1,
   *   "vendedorId": 2,
   *   "itens": [
   *     { "produtoId": 1, "quantidade": 2, "precoUnitario": 49.90 },
   *     { "produtoId": 3, "quantidade": 1, "precoUnitario": 19.90 }
   *   ]
   * }
   */
  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { clienteId, vendedorId, itens } = req.body;

      if (!clienteId || !vendedorId) {
        res.status(400).json({ mensagem: "Campos 'clienteId' e 'vendedorId' são obrigatórios." });
        return;
      }

      if (!Array.isArray(itens) || itens.length === 0) {
        res.status(400).json({ mensagem: "O campo 'itens' deve ser um array com pelo menos um item." });
        return;
      }

      const novoPedido = await this._service.criar(
        Number(clienteId),
        Number(vendedorId),
        itens
      );

      res.status(201).json(novoPedido);
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * DELETE /pedidos/:id
   * Remove um pedido e seus itens.
   */
  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) { res.status(400).json({ mensagem: "ID inválido." }); return; }

      await this._service.deletar(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };
}