-- CREATE DATABASE IF NOT EXISTS loja_atividade;
-- USE loja_atividade;

-- Tabela: CATEGORIAS
-- Armazena as categorias dos produtos
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Tabela: PRODUTOS
-- Armazena os produtos vinculados a uma categoria
-- vinculo_imagem: caminho/nome do arquivo salvo pelo Multer
CREATE TABLE IF NOT EXISTS produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    id_categoria INT NOT NULL,
    vinculo_imagem VARCHAR(255),
    CONSTRAINT fk_produto_categoria FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
);

-- Tabela: CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL
);

-- Tabela: VENDEDORES
CREATE TABLE IF NOT EXISTS vendedores (
    id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Tabela: PEDIDOS
-- valor_final calculado pela aplicação antes do INSERT
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_cliente INT NOT NULL,
    id_vendedor INT NOT NULL,
    valor_final DECIMAL(10, 2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente),
    CONSTRAINT fk_pedido_vendedor FOREIGN KEY (id_vendedor) REFERENCES vendedores (id_vendedor)
);

-- Tabela: ITENSPEDIDOS
-- preco_unitario preserva o preço histórico no momento da venda
CREATE TABLE IF NOT EXISTS itenspedidos (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_item_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido),
    CONSTRAINT fk_item_produto FOREIGN KEY (id_produto) REFERENCES produtos (id_produto)
);