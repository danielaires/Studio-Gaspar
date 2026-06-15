package com.br.aires.studio_gaspar.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

}
