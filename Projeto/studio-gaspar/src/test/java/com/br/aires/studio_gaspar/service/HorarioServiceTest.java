package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.dto.HorarioDTO;
import com.br.aires.studio_gaspar.entity.Horario;
import com.br.aires.studio_gaspar.repository.HorarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HorarioServiceTest {

    @Mock
    private HorarioRepository repository;

    @InjectMocks
    private HorarioService service;

    @Test
    void deveListarHorarios() {

        Horario horario = new Horario();
        horario.setId(1L);
        horario.setDescricao("Manhã");

        when(repository.findAll()).thenReturn(List.of(horario));

        List<Horario> resultado = service.listar();

        assertEquals(1, resultado.size());
        assertEquals("Manhã", resultado.get(0).getDescricao());

        verify(repository).findAll();
    }

    @Test
    void deveRetornarListaVazia() {

        when(repository.findAll()).thenReturn(List.of());

        List<Horario> resultado = service.listar();

        assertTrue(resultado.isEmpty());

        verify(repository).findAll();
    }

    @Test
    void deveListarHorariosComTotalAlunos() {

        HorarioDTO dto = new HorarioDTO(
                "Manhã",
                "08:00 às 09:00",
                10L
        );

        when(repository.listarComTotalAlunos())
                .thenReturn(List.of(dto));

        List<HorarioDTO> resultado =
                service.listarComTotalAlunos();

        assertEquals(1, resultado.size());
        assertEquals("Manhã", resultado.get(0).getDescricao());
        assertEquals(10L, resultado.get(0).getTotalAlunos());

        verify(repository).listarComTotalAlunos();
    }

    @Test
    void deveSalvarHorario() {

        Horario horario = new Horario();
        horario.setDescricao("Noite");
        horario.setHoraInicio(LocalTime.of(19, 0));
        horario.setHoraFim(LocalTime.of(20, 0));

        when(repository.save(horario))
                .thenReturn(horario);

        Horario resultado = service.salvar(horario);

        assertEquals("Noite", resultado.getDescricao());

        verify(repository).save(horario);
    }

    @Test
    void deveBuscarHorarioPorId() {

        Horario horario = new Horario();
        horario.setId(1L);

        when(repository.findById(1L))
                .thenReturn(Optional.of(horario));

        Horario resultado = service.buscarPorId(1L);

        assertEquals(1L, resultado.getId());

        verify(repository).findById(1L);
    }

    @Test
    void deveLancarExcecaoQuandoHorarioNaoExiste() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.buscarPorId(1L)
        );

        assertEquals(
                "Horário não encontrado com o ID: 1",
                exception.getMessage()
        );

        verify(repository).findById(1L);
    }

}