package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.entity.Mensalidade;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.br.aires.studio_gaspar.service.MensalidadeService;

import java.util.List;

@RestController
@RequestMapping("/mensalidades")
@RequiredArgsConstructor
public class MensalidadeController {

    private final MensalidadeService service;

    @GetMapping
    public List<Mensalidade> listar(){

        return service.listar();
    }

    @PostMapping
    public Mensalidade salvar(@RequestBody Mensalidade mensalidade){

        return service.salvar(mensalidade);
    }

}