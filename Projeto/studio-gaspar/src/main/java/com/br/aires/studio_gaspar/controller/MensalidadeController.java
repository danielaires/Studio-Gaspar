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

    @GetMapping("/aluno/{id}")
    public List<Mensalidade> listarPorAluno(@PathVariable Long id) {
        return service.listarPorAluno(id);
    }

    @PutMapping("/{id}/pagar")
    public Mensalidade marcarComoPago(@PathVariable Long id) {
        return service.marcarComoPago(id);
    }
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {

        service.excluir(id);
    }
    @GetMapping("/{id}")
    public Mensalidade buscarPorId(
            @PathVariable Long id) {

        return service.buscarPorId(id);
    }
    @PutMapping("/{id}")
    public Mensalidade atualizar(
            @PathVariable Long id,
            @RequestBody Mensalidade mensalidade) {

        return service.atualizar(id, mensalidade);
    }

}