package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.entity.Mensalidade;
import com.br.aires.studio_gaspar.service.MensalidadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mensalidades")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MensalidadeController {

    private final MensalidadeService service;

    @GetMapping
    public List<Mensalidade> listar() {
        return service.listar();
    }

    @PostMapping
    public Mensalidade salvar(@RequestBody Mensalidade mensalidade) {
        return service.salvar(mensalidade);
    }
    
}