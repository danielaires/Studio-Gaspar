package com.br.aires.studio_gaspar.repository;

import com.br.aires.studio_gaspar.dto.HorarioDTO;
import com.br.aires.studio_gaspar.entity.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HorarioRepository
        extends JpaRepository<Horario, Long> {

    @Query("""
    SELECT new com.br.aires.studio_gaspar.dto.HorarioDTO(
        h.descricao,
        CONCAT(
            FUNCTION('TIME_FORMAT', h.horaInicio, '%H:%i'),
            ' às ',
            FUNCTION('TIME_FORMAT', h.horaFim, '%H:%i')
        ),
        COUNT(a.id)
    )
    FROM Horario h
    LEFT JOIN Aluno a ON a.horario.id = h.id
    GROUP BY
        h.id,
        h.descricao,
        h.horaInicio,
        h.horaFim
    ORDER BY h.horaInicio
""")
    List<HorarioDTO> listarComTotalAlunos();

}