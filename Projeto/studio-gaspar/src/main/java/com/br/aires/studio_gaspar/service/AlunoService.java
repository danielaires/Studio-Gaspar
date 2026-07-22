package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Aluno;
import com.br.aires.studio_gaspar.repository.MensalidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.br.aires.studio_gaspar.repository.AlunoRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository repository;
    private final MensalidadeRepository mensalidadeRepository;

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

        if (mensalidadeRepository.existsByAlunoIdAndStatusIn(
                id,
                List.of("PENDENTE", "VENCIDO")
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "O aluno possui mensalidades pendentes ou vencidas e não pode ser excluído."
            );
        }

        repository.deleteById(id);
    }

}
