CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(100),
    tipo ENUM('administrador', 'jogador') NOT NULL
);

CREATE TABLE fotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    url_foto VARCHAR(255),
    descricao VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
