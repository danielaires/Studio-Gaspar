package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Aluno;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.br.aires.studio_gaspar.repository.AlunoRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository repository;

    public List<Aluno> listar(){

        return repository.findAll();
    }

    public Aluno buscar(Long id){

        return repository.findById(id)
                .orElseThrow();
    }

    public Aluno salvar(Aluno aluno){

        return repository.save(aluno);
    }

    public Aluno atualizar(Long id, Aluno aluno) {

        Aluno alunoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        aluno.setId(alunoExistente.getId());

        return repository.save(aluno);
    }

    public void excluir(Long id){

        repository.deleteById(id);
    }

}
