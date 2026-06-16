package com.br.aires.studio_gaspar.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "avaliacao_fisica")
public class AvaliacaoFisica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("dataAvaliacao")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataAvaliacao;

    private Double altura;
    private Double peso;
    private Double peito;
    private Double abdomen;
    private Double gluteo;
    private Double bracoEsquerdo;
    private Double bracoDireito;
    private Double coxaEsquerda;
    private Double coxaDireita;
    private Double panturrilhaEsquerda;
    private Double panturrilhaDireita;
    private Double triceps;
    private Double subescapular;
    private Double suprailiaca;
    private Double dobraAbdomen;

    @Column(length = 1000)
    private String observacao;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // Permite escrever (salvar), mas ignora na leitura
    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;
}