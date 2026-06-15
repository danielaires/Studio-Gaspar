package com.br.aires.studio_gaspar.repository;

import com.br.aires.studio_gaspar.entity.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HorarioRepository extends JpaRepository<Horario,Long> {

}
