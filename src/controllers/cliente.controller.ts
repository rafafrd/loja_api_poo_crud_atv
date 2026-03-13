import { Request, Response } from "express";
import { ClienteService }    from "../services/cliente.service";

export class ClienteController {
  private readonly _service: ClienteService;

  constructor() {
    this._service = new ClienteService();
  }

  /**
   * GET /clientes
   */
  listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const clientes = await this._service.listarTodos();
      res.status(200).json({ mensagem: "Clientes listados com sucesso.", clientes });
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  };

  /**
   * GET /clientes/:id
   */
  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) { res.status(400).json({ mensagem: "ID inválido." }); return; }

      const cliente = await this._service.buscarPorId(id);
      res.status(200).json({ mensagem: "Cliente encontrado com sucesso.", cliente });
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };

  /**
   * POST /clientes
   * Body: { nome: string, email: string }
   */
  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome, email } = req.body;
      if (!nome?.trim() || !email?.trim()) {
        res.status(400).json({ mensagem: "Campos 'nome' e 'email' são obrigatórios." });
        return;
      }
      const novoCliente = await this._service.criar(nome, email);
      res.status(201).json({ mensagem: "Cliente criado com sucesso.", cliente: novoCliente });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * PUT /clientes/:id
   * Body: { nome: string, email: string }
   */
  editar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) { res.status(400).json({ mensagem: "ID inválido." }); return; }

      const { nome, email } = req.body;
      if (!nome?.trim() || !email?.trim()) {
        res.status(400).json({ mensagem: "Campos 'nome' e 'email' são obrigatórios." });
        return;
      }
      const clienteAtualizado = await this._service.editar(id, nome, email);
      res.status(200).json({ mensagem: "Cliente atualizado com sucesso.", cliente: clienteAtualizado });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * DELETE /clientes/:id
   */
  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) { res.status(400).json({ mensagem: "ID inválido." }); return; }

      await this._service.deletar(id);
      res.status(204).setHeader("X-Message", "Cliente removido com sucesso.").send();
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };
}