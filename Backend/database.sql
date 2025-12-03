create table permissao
(
  id bigint  NOT NULL,
  descricao varchar NOT NULL,
  PRIMARY KEY (id)
);

create table usuario
(
  email varchar NOT NULL,
  nome varchar NOT NULL,
  senha varchar NOT NULL,
  PRIMARY KEY (email)
);


create table usuario_permissao
(
  email varchar NOT NULL,
  id_permissao bigint NOT NULL,
  PRIMARY KEY (email, id_permissao),
  CONSTRAINT FK_usuario_permissao_usuario FOREIGN KEY (email) REFERENCES usuario (email),
  CONSTRAINT FK_usuario_permissao_permissao FOREIGN KEY (id_permissao) REFERENCES permissao (id)
);



CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    nome_produto VARCHAR(150) NOT NULL,
    preco_unitario NUMERIC(10, 2) NOT NULL CHECK (preco_unitario >= 0)
);


CREATE TABLE venda (
    id_venda SERIAL PRIMARY KEY,
    data_venda TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    valor_total NUMERIC(10, 2) NOT NULL CHECK (valor_total >= 0)
);



CREATE TABLE item_venda (
    id_item_venda SERIAL PRIMARY KEY,
    id_venda INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    
    FOREIGN KEY (id_venda) REFERENCES VENDA(id_venda) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES PRODUTO(id_produto)
);

CREATE TABLE despesa (
    id_despesa SERIAL PRIMARY KEY,
    data_despesa DATE NOT NULL,
    tipo_despesa VARCHAR(50) NOT NULL,
    descricao VARCHAR(255),
    valor NUMERIC(10, 2) NOT NULL CHECK (valor > 0)
);


INSERT INTO permissao (id, descricao) VALUES (1, 'ADMINISTRADOR');
INSERT INTO permissao (id, descricao) VALUES (2, 'EMPREGADO');

-- Usuário administrador
INSERT INTO usuario (email, nome, senha) 
VALUES ('admin@sistema.com', 'Administrador', 'admin');

-- Usuário empregado
INSERT INTO usuario (email, nome, senha) 
VALUES ('empregado@sistema.com', 'Empregado', 'empregado');

-- Admin tem permissão de administrador
INSERT INTO usuario_permissao (email, id_permissao) 
VALUES ('admin@sistema.com', 1);

-- Empregado tem permissão de empregado
INSERT INTO usuario_permissao (email, id_permissao) 
VALUES ('empregado@sistema.com', 2);
