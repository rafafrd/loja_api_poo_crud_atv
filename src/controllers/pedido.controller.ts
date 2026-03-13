import { Request, Response } from "express";
import { PedidoService }     from "../services/pedido.service";

// para validar o body da requisição de criação de Pedido
const ausente   = (v: any): boolean => v === undefined || v === null || String(v).trim() === "";
const naoENumero = (v: any): boolean => Number.isNaN(Number(v));
const naoPositivo = (v: any): boolean => Number(v) <= 0;

export class PedidoController {
  private readonly _service: PedidoService;

  constructor() {
    this._service = new PedidoService();
  }

  /**
   * GET /pedidos
   */
  listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const pedidos = await this._service.listarTodos();
      res.status(200).json({ mensagem: "Pedidos listados com sucesso.", pedidos });
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  };

  /**
   * GET /pedidos/:id
   */
  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
      }
      const pedido = await this._service.buscarPorId(id);
      res.status(200).json({ mensagem: "Pedido encontrado com sucesso.", pedido });
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };

  /**
   * POST /pedidos
   * Body: {
   *   clienteId:  number,
   *   vendedorId: number,
   *   itens: [{ produtoId: number, quantidade: number }]
   * }
   * ⚠️  precoUnitario não é mais enviado pelo cliente —
   *     o Service busca automaticamente no banco.
   */
  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { clienteId, vendedorId, itens } = req.body;

      const erros: string[] = [];

      // -- Valida clienteId --
      if (ausente(clienteId))           erros.push("Campo 'clienteId' é obrigatório.");
      else if (naoENumero(clienteId))   erros.push("Campo 'clienteId' deve ser um número válido.");
      else if (naoPositivo(clienteId))  erros.push("Campo 'clienteId' deve ser maior que zero.");

      // -- Valida vendedorId --
      if (ausente(vendedorId))          erros.push("Campo 'vendedorId' é obrigatório.");
      else if (naoENumero(vendedorId))  erros.push("Campo 'vendedorId' deve ser um número válido.");
      else if (naoPositivo(vendedorId)) erros.push("Campo 'vendedorId' deve ser maior que zero.");

      // -- Valida array de itens --
      if (!Array.isArray(itens) || itens.length === 0) {
        erros.push("Campo 'itens' deve ser um array com pelo menos um item.");
      } else {
        // Valida cada item individualmente, indicando o índice com problema
        itens.forEach((item: any, index: number) => {
          const pos = `itens[${index}]`;

          if (ausente(item?.produtoId))
            erros.push(`${pos}: 'produtoId' é obrigatório.`);
          else if (naoENumero(item.produtoId))
            erros.push(`${pos}: 'produtoId' deve ser um número válido.`);
          else if (naoPositivo(item.produtoId))
            erros.push(`${pos}: 'produtoId' deve ser maior que zero.`);

          if (ausente(item?.quantidade))
            erros.push(`${pos}: 'quantidade' é obrigatório.`);
          else if (naoENumero(item.quantidade))
            erros.push(`${pos}: 'quantidade' deve ser um número válido.`);
          else if (Number(item.quantidade) < 1)
            erros.push(`${pos}: 'quantidade' deve ser pelo menos 1.`);
        });
      }

      if (erros.length > 0) {
        res.status(400).json({ mensagem: "Dados inválidos.", erros });
        return;
      }

      const novoPedido = await this._service.criar(
        Number(clienteId),
        Number(vendedorId),
        itens.map((i: any) => ({
          produtoId:  Number(i.produtoId),
          quantidade: Number(i.quantidade),
        }))
      );

      res.status(201).json({ mensagem: "Pedido criado com sucesso.", pedido: novoPedido });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * DELETE /pedidos/:id
   */
  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
      }
      await this._service.deletar(id);
      res.status(200)
        .setHeader("X-Message", "Pedido removido com sucesso.")
        .json({ mensagem: "Pedido removido com sucesso." });
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };
}