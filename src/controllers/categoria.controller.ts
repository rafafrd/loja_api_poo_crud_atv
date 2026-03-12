import { Request, Response } from "express";
import { CategoriaService } from "../services/categoria.service";

export class CategoriaController {
  private readonly _service: CategoriaService;

  constructor() {
    this._service = new CategoriaService();
  }

  /**
   * GET /categorias
   * Lista todas as categorias.
   */
  listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await this._service.listarTodos();
      res.status(200).json({ "categorias": categorias });
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  };

  /**
   * GET /categorias/:id
   * Retorna uma categoria pelo ID.
   */
  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
      }
      const categoria = await this._service.buscarPorId(id);
      res.status(200).json({ "categoria": categoria });
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };

  /**
   * POST /categorias
   * Cria uma nova categoria.
   * Body: { nome: string }
   */
  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome } = req.body;
      if (!nome?.trim()) {
        res.status(400).json({ mensagem: "Campo 'nome' é obrigatório." });
        return;
      }
      const novaCategoria = await this._service.criar(nome);
      res.status(201).json({ "categoria": novaCategoria });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * PUT /categorias/:id
   * Atualiza uma categoria existente.
   * Body: { nome: string }
   */
  editar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
      }
      const { nome } = req.body;
      if (!nome?.trim()) {
        res.status(400).json({ mensagem: "Campo 'nome' é obrigatório." });
        return;
      }
      const categoriaAtualizada = await this._service.editar(id, nome);
      res.status(200).json({ "categoria": categoriaAtualizada });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * DELETE /categorias/:id
   * Remove uma categoria.
   */
  deletar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
      }
      await this._service.deletar(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };
}