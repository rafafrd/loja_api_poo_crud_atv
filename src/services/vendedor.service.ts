import { Vendedor }           from "../models/vendedor.model";
import { VendedorRepository } from "../repository/vendedor.repository";

export class VendedorService {
  private readonly _repository: VendedorRepository;

  constructor() {
    this._repository = new VendedorRepository();
  }

  /** Retorna todos os vendedores. */
  async listarTodos(): Promise<Vendedor[]> {
    return await this._repository.findAll();
  }

  /**
   * Retorna um vendedor pelo ID.
   * @throws Error se não encontrado
   */
  async buscarPorId(id: number): Promise<Vendedor> {
    const vendedor = await this._repository.findById(id);
    if (!vendedor) throw new Error(`Vendedor com ID ${id} não encontrado.`);
    return vendedor;
  }

  /**
   * Cria um novo vendedor.
   * @param nome Nome do vendedor
   */
  async criar(nome: string): Promise<Vendedor> {
    const novoVendedor = Vendedor.criar(nome);
    const resultado    = await this._repository.create(novoVendedor);
    return Vendedor.editar(resultado.insertId, novoVendedor.Nome);
  }

  /**
   * Atualiza um vendedor existente.
   * @param id   ID do vendedor
   * @param nome Novo nome
   */
  async editar(id: number, nome: string): Promise<Vendedor> {
    await this.buscarPorId(id);
    const vendedorEditado = Vendedor.editar(id, nome);
    await this._repository.update(vendedorEditado);
    return vendedorEditado;
  }

  /**
   * Remove um vendedor pelo ID.
   * @param id ID do vendedor
   */
  async deletar(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this._repository.delete(id);
  }
}