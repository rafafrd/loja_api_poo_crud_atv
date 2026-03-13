import { Request, Response } from "express";
import { ProdutoService }    from "../services/produto.service";

/**
 * Verifica se um valor está ausente (undefined, null ou string vazia).
 */
const ausente = (valor: any): boolean =>
  valor === undefined || valor === null || String(valor).trim() === "";

/**
 * Verifica se um valor não pode ser convertido para número válido.
 */
const naoENumero = (valor: any): boolean =>
  Number.isNaN(Number(valor));

/**
 * Verifica se um número é menor ou igual a zero.
 */
const naoPositivo = (valor: any): boolean =>
  Number(valor) <= 0;

export class ProdutoController {
  private readonly _service: ProdutoService;

  constructor() {
    this._service = new ProdutoService();
  }

  /**
   * GET /produtos
   */
  listarTodos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const produtos = await this._service.listarTodos();
      res.status(200).json({ mensagem: "Produtos listados com sucesso.", produtos });
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
      res.status(200).json({ mensagem: "Produto encontrado com sucesso.", produto });
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
      res.status(200).json({ mensagem: "Produtos listados com sucesso.", produtos });
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  };

  /**
   * POST /produtos
   * Body: multipart/form-data { nome, preco, categoriaId, imagem? }
   */
  criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome, preco, categoriaId } = req.body;

      // --- validacao gigante credo ---
      const erros: string[] = [];

      if (ausente(nome))                        erros.push("Campo 'nome' é obrigatório.");
      if (ausente(preco))                        erros.push("Campo 'preco' é obrigatório.");
      else if (naoENumero(preco))               erros.push("Campo 'preco' deve ser um número válido.");
      else if (naoPositivo(preco))              erros.push("Campo 'preco' deve ser maior que zero.");

      if (ausente(categoriaId))                 erros.push("Campo 'categoriaId' é obrigatório.");
      else if (naoENumero(categoriaId))         erros.push("Campo 'categoriaId' deve ser um número válido.");
      else if (naoPositivo(categoriaId))        erros.push("Campo 'categoriaId' deve ser maior que zero.");

      if (erros.length > 0) {
        res.status(400).json({ mensagem: "Dados inválidos.", erros });
        return;
      }

      const vinculoImagem = req.file ? req.file.filename : null;

      const novoProduto = await this._service.criar(
        nome.trim(),
        Number(preco),
        Number(categoriaId),
        vinculoImagem
      );
      res.status(201).json({ mensagem: "Produto criado com sucesso.", produto: novoProduto });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  };

  /**
   * PUT /produtos/:id
   * Body: multipart/form-data { nome, preco, categoriaId, imagem? }
   */
  editar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
      }

      const { nome, preco, categoriaId } = req.body;

      const erros: string[] = [];

      if (ausente(nome))                        erros.push("Campo 'nome' é obrigatório.");
      if (ausente(preco))                        erros.push("Campo 'preco' é obrigatório.");
      else if (naoENumero(preco))               erros.push("Campo 'preco' deve ser um número válido.");
      else if (naoPositivo(preco))              erros.push("Campo 'preco' deve ser maior que zero.");

      if (ausente(categoriaId))                 erros.push("Campo 'categoriaId' é obrigatório.");
      else if (naoENumero(categoriaId))         erros.push("Campo 'categoriaId' deve ser um número válido.");
      else if (naoPositivo(categoriaId))        erros.push("Campo 'categoriaId' deve ser maior que zero.");

      if (erros.length > 0) {
        res.status(400).json({ mensagem: "Dados inválidos.", erros });
        return;
      }

      const vinculoImagem = req.file ? req.file.filename : null;

      const produtoAtualizado = await this._service.editar(
        id,
        nome.trim(),
        Number(preco),
        Number(categoriaId),
        vinculoImagem
      );
      res.status(200).json({ mensagem: "Produto atualizado com sucesso.", produto: produtoAtualizado });
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
        .json({ mensagem: "Produto removido com sucesso." });
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  };
}