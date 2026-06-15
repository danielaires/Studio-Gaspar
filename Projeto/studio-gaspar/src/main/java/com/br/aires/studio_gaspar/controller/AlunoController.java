package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.entity.Aluno;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.br.aires.studio_gaspar.service.AlunoService;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/alunos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AlunoController {

    private final AlunoService service;

    @GetMapping
    public List<Aluno> listar(){

        return service.listar();
    }

    @GetMapping("/{id}")
    public Aluno buscar(@PathVariable Long id){

        return service.buscar(id);
    }

    @PostMapping
    public Aluno salvar(@RequestBody Aluno aluno){

        return service.salvar(aluno);
    }

    @PutMapping("/{id}")
    public Aluno atualizar(@PathVariable Long id,
                           @RequestBody Aluno aluno){

        return service.atualizar(id, aluno);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id){

        service.excluir(id);
    }

}
