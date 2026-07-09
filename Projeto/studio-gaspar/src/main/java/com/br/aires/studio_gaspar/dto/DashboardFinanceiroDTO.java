package com.br.aires.studio_gaspar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardFinanceiroDTO {

    private BigDecimal totalRecebido;

    private BigDecimal totalReceber;

    private Long totalPagas;

    private Long totalPendentes;

    private Long totalVencidas;

    private Long totalMensalidades;

    private Double inadimplencia;

}