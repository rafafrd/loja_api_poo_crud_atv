import { Produto } from "../models/produto.model";
import { ProdutoRepository } from "../repository/produto.repository";

export class ProdutoService {
  private readonly _repository: ProdutoRepository;

  constructor() {
    this._repository = new ProdutoRepository();
  }

  /** Retorna todos os produtos. */
  async listarTodos(): Promise<Produto[]> {
    return await this._repository.findAll();
  }

  /**
   * Retorna um produto pelo ID.
   * @throws Error se não encontrado
   */
  async buscarPorId(id: number): Promise<Produto> {
    const produto = await this._repository.findById(id);
    if (!produto) throw new Error(`Produto com ID ${id} não encontrado.`);
    return produto;
  }

  /**
   * Retorna todos os produtos de uma categoria.
   * @param categoriaId FK da categoria
   */
  async listarPorCategoria(categoriaId: number): Promise<Produto[]> {
    return await this._repository.findByCategoria(categoriaId);
  }

  /**
   * Cria um novo produto com imagem opcional.
   * @param nome          Nome do produto
   * @param preco         Preço (> 0)
   * @param categoriaId   FK da categoria
   * @param vincutoImagem Caminho salvo pelo Multer (opcional)
   */
  async criar(
    nome:          string,
    preco:         number,
    categoriaId:   number,
    vincutoImagem: string | null = null
  ): Promise<Produto> {
    const novoProduto = Produto.criar(nome, preco, categoriaId, vincutoImagem);
    const resultado   = await this._repository.create(novoProduto);

    return Produto.editar(
      resultado.insertId,
      novoProduto.Nome,
      novoProduto.Preco,
      novoProduto.CategoriaId,
      novoProduto.VincutoImagem
    );
  }

  /**
   * Atualiza um produto existente.
   */
  async editar(
    id:            number,
    nome:          string,
    preco:         number,
    categoriaId:   number,
    vincutoImagem: string | null = null
  ): Promise<Produto> {
    await this.buscarPorId(id);

    const produtoEditado = Produto.editar(id, nome, preco, categoriaId, vincutoImagem);
    await this._repository.update(produtoEditado);
    return produtoEditado;
  }

  /**
   * Remove um produto pelo ID.
   */
  async deletar(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this._repository.delete(id);
  }
}