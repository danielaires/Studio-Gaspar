package com.br.aires.studio_gaspar.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "alunos")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private LocalDate dataNascimento;

    private String sexo;

    private String profissao;

    private String telefone;

    private LocalDate dataInicio;

    private String objetivo;

    private String foto;

    private Boolean ativo = true;

    @ManyToOne
    @JoinColumn(name = "horario_id")
    private Horario horario;

    @OneToMany(mappedBy = "aluno")
    @JsonIgnoreProperties("aluno")
    private List<Mensalidade> mensalidades;

    @OneToMany(mappedBy = "aluno")
    @JsonIgnoreProperties("aluno")
    private List<AvaliacaoFisica> avaliacoes;

}
