package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Mensalidade;
import com.br.aires.studio_gaspar.repository.MensalidadeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MensalidadeServiceTest {

    @Mock
    private MensalidadeRepository repository;

    @InjectMocks
    private MensalidadeService service;

    @Test
    void deveSalvarMensalidade() {

        Mensalidade mensalidade = new Mensalidade();
        mensalidade.setValor(BigDecimal.valueOf(150.00));

        when(repository.save(mensalidade)).thenReturn(mensalidade);

        Mensalidade resultado = service.salvar(mensalidade);

        assertNotNull(resultado);
        assertEquals(BigDecimal.valueOf(150.00), resultado.getValor());

        verify(repository).save(mensalidade);
    }

    @Test
    void deveBuscarPorId() {

        Mensalidade mensalidade = new Mensalidade();
        mensalidade.setId(1L);

        when(repository.findById(1L))
                .thenReturn(Optional.of(mensalidade));

        Mensalidade resultado = service.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());

        verify(repository).findById(1L);
    }

    @Test
    void deveLancarRuntimeQuandoBuscarMensalidadeInexistente() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.buscarPorId(1L)
        );

        assertEquals("Mensalidade não encontrada", exception.getMessage());

        verify(repository).findById(1L);
    }

    @Test
    void deveExcluirMensalidade() {

        doNothing().when(repository).deleteById(1L);

        assertDoesNotThrow(() -> service.excluir(1L));

        verify(repository).deleteById(1L);
    }

    @Test
    void deveAtualizarMensalidade() {

        Mensalidade existente = new Mensalidade();
        existente.setId(1L);

        Mensalidade dados = new Mensalidade();
        dados.setValor(BigDecimal.valueOf(200.00));
        dados.setStatus("PAGO");
        dados.setPagamento(LocalDate.now());
        dados.setVencimento(LocalDate.now().plusDays(30));

        when(repository.findById(1L))
                .thenReturn(Optional.of(existente));

        when(repository.save(any(Mensalidade.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Mensalidade resultado = service.atualizar(1L, dados);

        assertEquals(BigDecimal.valueOf(200.00), resultado.getValor());
        assertEquals("PAGO", resultado.getStatus());
        assertEquals(dados.getPagamento(), resultado.getPagamento());
        assertEquals(dados.getVencimento(), resultado.getVencimento());

        verify(repository).findById(1L);
        verify(repository).save(any(Mensalidade.class));
    }

    @Test
    void deveLancarNoSuchElementAoAtualizarMensalidadeInexistente() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                NoSuchElementException.class,
                () -> service.atualizar(1L, new Mensalidade())
        );

        verify(repository).findById(1L);
        verify(repository, never()).save(any());
    }

    @Test
    void deveMarcarMensalidadeComoPaga() {

        Mensalidade mensalidade = new Mensalidade();
        mensalidade.setId(1L);
        mensalidade.setStatus("PENDENTE");

        when(repository.findById(1L))
                .thenReturn(Optional.of(mensalidade));

        when(repository.save(any(Mensalidade.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Mensalidade resultado = service.marcarComoPago(1L);

        assertEquals("PAGO", resultado.getStatus());
        assertNotNull(resultado.getPagamento());

        verify(repository).findById(1L);
        verify(repository).save(any(Mensalidade.class));
    }

    @Test
    void deveLancarRuntimeAoMarcarMensalidadeInexistenteComoPaga() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.marcarComoPago(1L)
        );

        assertEquals("Mensalidade não encontrada", exception.getMessage());

        verify(repository).findById(1L);
        verify(repository, never()).save(any());
    }

    @Test
    void deveListarMensalidades() {

        Mensalidade mensalidade = new Mensalidade();
        mensalidade.setStatus("PAGO");

        when(repository.findAll())
                .thenReturn(List.of(mensalidade));

        List<Mensalidade> lista = service.listar();

        assertEquals(1, lista.size());

        verify(repository, atLeastOnce()).findAll();
    }

    @Test
    void deveListarMensalidadesPorAluno() {

        Mensalidade mensalidade = new Mensalidade();

        when(repository.findAll())
                .thenReturn(List.of());

        when(repository.findByAlunoId(1L))
                .thenReturn(List.of(mensalidade));

        List<Mensalidade> lista = service.listarPorAluno(1L);

        assertEquals(1, lista.size());

        verify(repository).findByAlunoId(1L);
    }

}