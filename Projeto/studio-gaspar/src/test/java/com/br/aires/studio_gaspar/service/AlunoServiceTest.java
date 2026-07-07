package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Aluno;
import com.br.aires.studio_gaspar.repository.AlunoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlunoServiceTest {

    @Mock
    private AlunoRepository repository;

    @InjectMocks
    private AlunoService service;

    @Test
    void deveListarAlunos() {

        Aluno aluno = new Aluno();
        aluno.setId(1L);
        aluno.setNome("Daniel");

        when(repository.findAll()).thenReturn(List.of(aluno));

        List<Aluno> resultado = service.listar();

        assertEquals(1, resultado.size());
        assertEquals("Daniel", resultado.get(0).getNome());

        verify(repository).findAll();
    }

    @Test
    void deveRetornarListaVazia() {

        when(repository.findAll()).thenReturn(List.of());

        List<Aluno> resultado = service.listar();

        assertTrue(resultado.isEmpty());

        verify(repository).findAll();
    }

    @Test
    void deveBuscarAlunoPorId() {

        Aluno aluno = new Aluno();
        aluno.setId(1L);

        when(repository.findById(1L))
                .thenReturn(Optional.of(aluno));

        Aluno resultado = service.buscar(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());

        verify(repository).findById(1L);
    }

    @Test
    void deveLancarNoSuchElementQuandoNaoEncontrarAluno() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class,
                () -> service.buscar(1L));

        verify(repository).findById(1L);
    }

    @Test
    void deveSalvarAluno() {

        Aluno aluno = new Aluno();
        aluno.setNome("Daniel");

        when(repository.save(aluno))
                .thenReturn(aluno);

        Aluno salvo = service.salvar(aluno);

        assertEquals("Daniel", salvo.getNome());

        verify(repository).save(aluno);
    }

    @Test
    void deveAtualizarAluno() {

        Aluno existente = new Aluno();
        existente.setId(1L);
        existente.setNome("Antigo");

        Aluno atualizado = new Aluno();
        atualizado.setNome("Novo");

        when(repository.findById(1L))
                .thenReturn(Optional.of(existente));

        when(repository.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Aluno resultado = service.atualizar(1L, atualizado);

        assertEquals(1L, resultado.getId());
        assertEquals("Novo", resultado.getNome());

        verify(repository).findById(1L);
        verify(repository).save(any(Aluno.class));
    }

    @Test
    void deveLancarRuntimeAoAtualizarAlunoInexistente() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.atualizar(1L, new Aluno())
        );

        assertEquals("Aluno não encontrado", ex.getMessage());

        verify(repository).findById(1L);

        verify(repository, never()).save(any());
    }

    @Test
    void deveExcluirAluno() {

        doNothing().when(repository).deleteById(1L);

        service.excluir(1L);

        verify(repository).deleteById(1L);
    }

}