package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Horario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.br.aires.studio_gaspar.repository.HorarioRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioService {

    private final HorarioRepository repository;

    public List<Horario> listar(){
        return repository.findAll();
    }

    public Horario salvar(Horario horario){
        return repository.save(horario);
    }

    // Método adicionado para atender a requisição do Controller
    public Horario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horário não encontrado com o ID: " + id));
    }
}