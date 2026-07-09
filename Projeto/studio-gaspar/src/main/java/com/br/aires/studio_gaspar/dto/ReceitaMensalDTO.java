package com.br.aires.studio_gaspar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ReceitaMensalDTO {

    private String mes;
    private BigDecimal valor;

}