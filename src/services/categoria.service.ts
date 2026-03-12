import { Categoria } from "../models/categoria.model";
import { CategoriaRepository } from "../repository/categoria.repository";

export class CategoriaService {
  private readonly _repository: CategoriaRepository;

  constructor() {
    this._repository = new CategoriaRepository();
  }

  /**
   * Retorna todas as categorias cadastradas.
   */
  async listarTodos(): Promise<Categoria[]> {
    return await this._repository.findAll();
  }

  /**
   * Retorna uma categoria pelo ID.
   * @throws Error se não encontrada
   */
  async buscarPorId(id: number): Promise<Categoria> {
    const categoria = await this._repository.findById(id);
    if (!categoria) {
      throw new Error(`Categoria com ID ${id} não encontrada.`);
    }
    return categoria;
  }

  /**
   * Cria uma nova categoria.
   * A Factory valida os dados antes de persistir.
   * @param nome Nome da nova categoria
   */
  async criar(nome: string): Promise<Categoria> {
    // Factory Method — objeto já nasce validado
    const novaCategoria = Categoria.criar(nome);
    const resultado     = await this._repository.create(novaCategoria);

    // Reconstrói o obj com o ID gerado pelo banco
    return Categoria.editar(resultado.insertId, novaCategoria.Nome);
  }

  /**
   * Atualiza uma categoria existente.
   * @param id   ID da categoria a editar
   * @param nome Novo nome
   */
  async editar(id: number, nome: string): Promise<Categoria> {
    await this.buscarPorId(id); // garante que existe

    const categoriaEditada = Categoria.editar(id, nome);
    await this._repository.update(categoriaEditada);
    return categoriaEditada;
  }

  /**
   * Remove uma categoria pelo ID.
   * @param id ID da categoria
   */
  async deletar(id: number): Promise<void> {
    await this.buscarPorId(id); // garante que existe
    await this._repository.delete(id);
  }
}