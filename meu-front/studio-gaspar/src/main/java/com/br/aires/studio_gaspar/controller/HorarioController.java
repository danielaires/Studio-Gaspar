package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.entity.Horario;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.br.aires.studio_gaspar.service.HorarioService;

import java.util.List;

@RestController
@RequestMapping("/horarios")
@RequiredArgsConstructor
public class HorarioController {

    private final HorarioService service;

    @GetMapping
    public List<Horario> listar(){

        return service.listar();
    }

    @PostMapping
    public Horario salvar(@RequestBody Horario horario){

        return service.salvar(horario);
    }

}
