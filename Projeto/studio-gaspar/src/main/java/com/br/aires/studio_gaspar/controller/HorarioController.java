package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.dto.HorarioDTO;
import com.br.aires.studio_gaspar.entity.Horario;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.br.aires.studio_gaspar.service.HorarioService;

import java.util.List;

@RestController
@RequestMapping("/horarios")
@RequiredArgsConstructor
// Adicionado para permitir a conexão do seu React (porta 5173)
@CrossOrigin(origins = "http://localhost:5173")
public class HorarioController {

    private final HorarioService service;

    @GetMapping
    public List<Horario> listar() {
        return service.listar();
    }

    @GetMapping("/resumo")
    public List<HorarioDTO> listarComTotalAlunos() {

        return service.listarComTotalAlunos();

    }

    @PostMapping
    public Horario salvar(@RequestBody Horario horario) {
        return service.salvar(horario);
    }
}