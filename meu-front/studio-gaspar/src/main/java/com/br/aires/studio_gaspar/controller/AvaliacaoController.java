package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.entity.AvaliacaoFisica;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.br.aires.studio_gaspar.service.AvaliacaoService;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
@RequiredArgsConstructor
public class AvaliacaoController {

    private final AvaliacaoService service;

    @GetMapping
    public List<AvaliacaoFisica> listar(){

        return service.listar();
    }

    @PostMapping
    public AvaliacaoFisica salvar(@RequestBody AvaliacaoFisica avaliacao){

        return service.salvar(avaliacao);
    }

}
