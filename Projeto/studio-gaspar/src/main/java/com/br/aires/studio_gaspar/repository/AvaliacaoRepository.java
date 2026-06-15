package com.br.aires.studio_gaspar.repository;

import com.br.aires.studio_gaspar.entity.AvaliacaoFisica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<AvaliacaoFisica,Long> {

    List<AvaliacaoFisica> findByAlunoId(Long alunoId);

}
