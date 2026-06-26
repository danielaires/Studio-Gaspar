package com.br.aires.studio_gaspar.repository;

import com.br.aires.studio_gaspar.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    List<Aluno> findByNomeContainingIgnoreCase(String nome);

    List<Aluno> findByAtivo(Boolean ativo);

    List<Aluno> findByHorarioId(Long horarioId);

    @Query("""
       SELECT a FROM Aluno a
               WHERE a.ativo = true
               AND DAY(a.dataNascimento) = DAY(CURRENT_DATE)
               AND MONTH(a.dataNascimento) = MONTH(CURRENT_DATE)
    """)
    List<Aluno> buscarAniversariantesHoje();

}