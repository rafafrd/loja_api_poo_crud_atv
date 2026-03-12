import { Cliente }             from "../models/cliente.model";
import { ClienteRepository }   from "../repository/cliente.repository";

export class ClienteService {
  private readonly _repository: ClienteRepository;

  constructor() {
    this._repository = new ClienteRepository();
  }

  /** Retorna todos os clientes. */
  async listarTodos(): Promise<Cliente[]> {
    return await this._repository.findAll();
  }

  /**
   * Retorna um cliente pelo ID.
   * @throws Error se não encontrado
   */
  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this._repository.findById(id);
    if (!cliente) throw new Error(`Cliente com ID ${id} não encontrado.`);
    return cliente;
  }

  /**
   * Cria um novo cliente.
   * @param nome  Nome do cliente
   * @param email E-mail do cliente
   */
  async criar(nome: string, email: string): Promise<Cliente> {
    const novoCliente = Cliente.criar(nome, email);
    const resultado   = await this._repository.create(novoCliente);
    return Cliente.editar(resultado.insertId, novoCliente.Nome, novoCliente.Email);
  }

  /**
   * Atualiza um cliente existente.
   * @param id    ID do cliente
   * @param nome  Novo nome
   * @param email Novo e-mail
   */
  async editar(id: number, nome: string, email: string): Promise<Cliente> {
    await this.buscarPorId(id);
    const clienteEditado = Cliente.editar(id, nome, email);
    await this._repository.update(clienteEditado);
    return clienteEditado;
  }

  /**
   * Remove um cliente pelo ID.
   * @param id ID do cliente
   */
  async deletar(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this._repository.delete(id);
  }
}