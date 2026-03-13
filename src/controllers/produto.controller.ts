import { Request, Response } from "express";
import { ProdutoService } from "../services/produto.service";

export class ProdutoController {
  private readonly _service: ProdutoService;

  constructor() {
    this._service = new ProdutoService();
  }

  /**
   * GET /produtos
   * Lista todos os produtos.
   */
  listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const produtos = await this._service.listarTodos();
      res.status(200).json(produtos);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  };

  /**
   * GET /produtos/:id
   */
  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
      }
      const produto = await this._service.buscarPorId(id);
      res.status(200).json(produto);
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };

  /**
   * GET /produtos/categoria/:categoriaId
   */
  listarPorCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoriaId = Number(req.params.categoriaId);
      if (Number.isNaN(categoriaId)) {
        res.status(400).json({ mensagem: "ID de categoria inválido." });
        return;
      }
      const produtos = await this._service.listarPorCategoria(categoriaId);
      res.status(200).json(produtos);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  };

  /**
   * POST /produtos
   * Cria um produto. Espera multipart/form-data quando há imagem.
   * Body: { nome, preco, categoriaId }
   * File:  req.file (opcional, processado pelo Multer)
   */
  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome, preco, categoriaId } = req.body;

      if (!nome?.trim() || !preco || !categoriaId) {
        res.status(400).json({ mensagem: "Campos 'nome', 'preco' e 'categoriaId' são obrigatórios." });
        return;
      }

      // Caminho da imagem gerado pelo Multer (opcional)
      const vinculoImagem = req.file ? req.file.filename : null;

      const novoProduto = await this._service.criar(
        nome,
        Number(preco),
        Number(categoriaId),
        vinculoImagem
      );
      res.status(201).json(novoProduto);
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * PUT /produtos/:id
   */
  editar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
      }

      const { nome, preco, categoriaId } = req.body;
      if (!nome?.trim() || !preco || !categoriaId) {
        res.status(400).json({ mensagem: "Campos 'nome', 'preco' e 'categoriaId' são obrigatórios." });
        return;
      }

      const vinculoImagem = req.file ? req.file.filename : null;

      const produtoAtualizado = await this._service.editar(
        id,
        nome,
        Number(preco),
        Number(categoriaId),
        vinculoImagem
      );
      res.status(200).json(produtoAtualizado);
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * DELETE /produtos/:id
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
        .setHeader("X-Message", "Produto removido com sucesso.")
        .json({ message: "Delete efetuado com sucesso." });
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };
}