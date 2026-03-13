import { Request, Response } from "express";
import { CategoriaService } from "../services/categoria.service";

export class CategoriaController {
  private readonly _service: CategoriaService;

  constructor() {
    this._service = new CategoriaService();
  }

  private tratarErro(error: any, res: Response): void {
    const mensagemErro = String(error?.message || "").toLowerCase();

    if (mensagemErro.includes("não encontrado") || mensagemErro.includes("nao encontrado")) {
      res.status(404).json({ mensagem: "Categoria não encontrada." });
      return;
    }

    if (
      mensagemErro.includes("inválido") ||
      mensagemErro.includes("invalido") ||
      mensagemErro.includes("obrigatório") ||
      mensagemErro.includes("obrigatorio")
    ) {
      res.status(400).json({ mensagem: "Dados inválidos. Revise os campos e tente novamente." });
      return;
    }

    res.status(500).json({ mensagem: "Não foi possível processar sua solicitação agora. Tente novamente mais tarde." });
  }

  /**
   * GET /categorias
   * Lista todas as categorias.
   */
  listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await this._service.listarTodos();
      res.status(200).json({ mensagem: "Categorias listadas com sucesso.", categorias });
    } catch (error: any) {
      this.tratarErro(error, res);
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
      res.status(200).json({ mensagem: "Categoria encontrada com sucesso.", categoria });
    } catch (error: any) {
      this.tratarErro(error, res);
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
      if (nome === null || nome === undefined || !String(nome).trim()) {
        res.status(400).json({ mensagem: "Campo 'nome' é obrigatório." });
        return;
      }
      const novaCategoria = await this._service.criar(nome);
      res.status(201).json({ mensagem: "Categoria criada com sucesso.", categoria: novaCategoria });
    } catch (error: any) {
      this.tratarErro(error, res);
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
      if (nome === null || nome === undefined || !String(nome).trim()) {
        res.status(400).json({ mensagem: "Campo 'nome' é obrigatório." });
        return;
      }
      const categoriaAtualizada = await this._service.editar(id, nome);
      res.status(200).json({ mensagem: "Categoria atualizada com sucesso.", categoria: categoriaAtualizada });
    } catch (error: any) {
      this.tratarErro(error, res);
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
      res.status(204).setHeader("X-Message", "Categoria removida com sucesso.").send();
    } catch (error: any) {
      this.tratarErro(error, res);
    }
  };
}