package com.br.aires.studio_gaspar.controller;
import com.br.aires.studio_gaspar.dto.DashboardFinanceiroDTO;
import com.br.aires.studio_gaspar.dto.ReceitaMensalDTO;
import com.br.aires.studio_gaspar.service.DashboardFinanceiroService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/financeiro")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardFinanceiroController {

    private final DashboardFinanceiroService service;

    @GetMapping("/dashboard")
    public DashboardFinanceiroDTO dashboard() {

        return service.buscarDashboard();

    }
    @GetMapping("/receita-mensal")
    public List<ReceitaMensalDTO> receitaMensal() {

        return service.buscarReceitaMensal();

    }

}
