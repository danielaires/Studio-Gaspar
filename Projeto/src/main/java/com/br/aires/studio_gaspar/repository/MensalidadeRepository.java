package com.br.aires.studio_gaspar.repository;

import com.br.aires.studio_gaspar.entity.Mensalidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MensalidadeRepository extends JpaRepository<Mensalidade,Long> {

    List<Mensalidade> findByStatus(String status);

    List<Mensalidade> findByStatusIn(List<String> status);

    List<Mensalidade> findByAlunoId(Long alunoId);

    List<Mensalidade> findByVencimento(LocalDate data);

}
