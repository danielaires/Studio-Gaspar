package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.AvaliacaoFisica;
import com.br.aires.studio_gaspar.repository.AvaliacaoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AvaliacaoServiceTest {

    @Mock
    private AvaliacaoRepository repository;

    @InjectMocks
    private AvaliacaoService service;

    @Test
    void deveListarAvaliacoes() {

        AvaliacaoFisica avaliacao = new AvaliacaoFisica();
        avaliacao.setId(1L);

        when(repository.findAll()).thenReturn(List.of(avaliacao));

        List<AvaliacaoFisica> lista = service.listar();

        assertEquals(1, lista.size());
        assertEquals(1L, lista.get(0).getId());

        verify(repository).findAll();
    }

    @Test
    void deveRetornarListaVazia() {

        when(repository.findAll()).thenReturn(List.of());

        List<AvaliacaoFisica> lista = service.listar();

        assertTrue(lista.isEmpty());

        verify(repository).findAll();
    }

    @Test
    void deveSalvarAvaliacaoComDataInformada() {

        AvaliacaoFisica avaliacao = new AvaliacaoFisica();
        avaliacao.setDataAvaliacao(LocalDate.of(2026, 7, 7));

        when(repository.save(avaliacao)).thenReturn(avaliacao);

        AvaliacaoFisica resultado = service.salvar(avaliacao);

        assertEquals(LocalDate.of(2026, 7, 7), resultado.getDataAvaliacao());

        verify(repository).save(avaliacao);
    }

    @Test
    void deveSalvarAvaliacaoSemData() {

        AvaliacaoFisica avaliacao = new AvaliacaoFisica();

        when(repository.save(any(AvaliacaoFisica.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AvaliacaoFisica resultado = service.salvar(avaliacao);

        assertNotNull(resultado.getDataAvaliacao());
        assertEquals(LocalDate.now(), resultado.getDataAvaliacao());

        verify(repository).save(any(AvaliacaoFisica.class));
    }

    @Test
    void deveExcluirAvaliacao() {

        doNothing().when(repository).deleteById(1L);

        assertDoesNotThrow(() -> service.excluir(1L));

        verify(repository).deleteById(1L);
    }

    @Test
    void deveBuscarAvaliacoesPorAluno() {

        AvaliacaoFisica avaliacao = new AvaliacaoFisica();

        when(repository.findByAlunoId(1L))
                .thenReturn(List.of(avaliacao));

        List<AvaliacaoFisica> lista = service.buscarPorAlunoId(1L);

        assertEquals(1, lista.size());

        verify(repository).findByAlunoId(1L);
    }

    @Test
    void deveBuscarPorId() {

        AvaliacaoFisica avaliacao = new AvaliacaoFisica();
        avaliacao.setId(1L);

        when(repository.findById(1L))
                .thenReturn(Optional.of(avaliacao));

        AvaliacaoFisica resultado = service.buscarPorId(1L);

        assertEquals(1L, resultado.getId());

        verify(repository).findById(1L);
    }

    @Test
    void deveLancarExcecaoQuandoAvaliacaoNaoExiste() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.buscarPorId(1L)
        );

        assertEquals(
                "Avaliação não encontrada com o ID: 1",
                exception.getMessage()
        );

        verify(repository).findById(1L);
    }
}