package com.br.aires.studio_gaspar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class HorarioDTO {

    private String descricao;
    private String faixaHorario;
    private Long totalAlunos;

}