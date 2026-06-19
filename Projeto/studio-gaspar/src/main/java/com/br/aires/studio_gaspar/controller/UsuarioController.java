package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.entity.Usuario;
import com.br.aires.studio_gaspar.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioService service;

    @PostMapping
    public Usuario salvar(
            @RequestBody Usuario usuario) {

        return service.salvar(usuario);
    }

    @GetMapping
    public List<Usuario> listar() {

        return service.listar();
    }
    @GetMapping("/{id}")
    public Usuario buscarPorId(
            @PathVariable Long id) {

        return service.buscarPorId(id);
    }
    @PutMapping("/{id}")
    public Usuario atualizar(
            @PathVariable Long id,
            @RequestBody Usuario usuario) {

        return service.atualizar(id, usuario);
    }

    @DeleteMapping("/{id}")
    public void excluir(
            @PathVariable Long id) {

        service.excluir(id);
    }
}