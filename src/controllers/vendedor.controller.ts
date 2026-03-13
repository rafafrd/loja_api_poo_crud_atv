import { Request, Response } from "express";
import { VendedorService }   from "../services/vendedor.service";

export class VendedorController {
  private readonly _service: VendedorService;

  constructor() {
    this._service = new VendedorService();
  }

  /**
   * GET /vendedores
   */
  listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const vendedores = await this._service.listarTodos();
      res.status(200).json(vendedores);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  };

  /**
   * GET /vendedores/:id
   */
  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) { res.status(400).json({ mensagem: "ID inválido." }); return; }

      const vendedor = await this._service.buscarPorId(id);
      res.status(200).json(vendedor);
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };

  /**
   * POST /vendedores
   * Body: { nome: string }
   */
  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome } = req.body;
      if (!nome?.trim()) {
        res.status(400).json({ mensagem: "Campo 'nome' é obrigatório." });
        return;
      }
      const novoVendedor = await this._service.criar(nome);
      res.status(201).json(novoVendedor);
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * PUT /vendedores/:id
   * Body: { nome: string }
   */
  editar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) { res.status(400).json({ mensagem: "ID inválido." }); return; }

      const { nome } = req.body;
      if (!nome?.trim()) {
        res.status(400).json({ mensagem: "Campo 'nome' é obrigatório." });
        return;
      }
      const vendedorAtualizado = await this._service.editar(id, nome);
      res.status(200).json(vendedorAtualizado);
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * DELETE /vendedores/:id
   */
  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) { res.status(400).json({ mensagem: "ID inválido." }); return; }

      await this._service.deletar(id);
      res.status(204).setHeader("X-Message", "Vendedor removido com sucesso.").send();
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };
}