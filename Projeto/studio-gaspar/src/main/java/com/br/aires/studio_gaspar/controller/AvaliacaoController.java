package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.entity.AvaliacaoFisica;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.br.aires.studio_gaspar.service.AvaliacaoService;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
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

    @GetMapping("/aluno/{alunoId}")
    public List<AvaliacaoFisica> listarPorAluno(@PathVariable Long alunoId) {
        return service.buscarPorAlunoId(alunoId);
    }

    // --- NOVO ENDPOINT PARA O BOTÃO DE DETALHES ---
    @GetMapping("/{id}")
    public AvaliacaoFisica buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

}