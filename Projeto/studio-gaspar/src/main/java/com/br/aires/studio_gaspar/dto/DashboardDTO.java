package com.br.aires.studio_gaspar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

    private Long alunosAtivos;
    private Long alunosInativos;
    private Long mensalidadesPagas;
    private Long mensalidadesVencidas;

    private Double valorRecebido;
    private Double valorPendente;
}