CREATE TABLE IF NOT EXISTS avaliacao_fisica_fotos (
    avaliacao_id BIGINT NOT NULL,
    foto LONGTEXT NOT NULL,
    CONSTRAINT fk_avaliacao_fisica_fotos_avaliacao
        FOREIGN KEY (avaliacao_id) REFERENCES avaliacao_fisica(id)
);
