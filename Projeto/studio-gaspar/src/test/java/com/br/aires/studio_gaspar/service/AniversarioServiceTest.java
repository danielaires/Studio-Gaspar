package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Aluno;
import com.br.aires.studio_gaspar.repository.AlunoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AniversarioServiceTest {

    @Mock
    private AlunoRepository alunoRepository;

    @Mock
    private WhatsAppService whatsAppService;

    @InjectMocks
    private AniversarioService service;

    @Test
    void deveEnviarMensagemParaUmAniversariante() {

        Aluno aluno = new Aluno();
        aluno.setNome("Daniel");
        aluno.setTelefone("63999999999");

        when(alunoRepository.buscarAniversariantesHoje())
                .thenReturn(List.of(aluno));

        service.enviarMensagensAniversario();

        verify(alunoRepository).buscarAniversariantesHoje();

        verify(whatsAppService).enviarMensagem(
                eq("63999999999"),
                contains("Daniel")
        );
    }

    @Test
    void deveEnviarMensagemParaDoisAniversariantes() {

        Aluno aluno1 = new Aluno();
        aluno1.setNome("Daniel");
        aluno1.setTelefone("63999999999");

        Aluno aluno2 = new Aluno();
        aluno2.setNome("Maria");
        aluno2.setTelefone("62988888888");

        when(alunoRepository.buscarAniversariantesHoje())
                .thenReturn(List.of(aluno1, aluno2));

        service.enviarMensagensAniversario();

        verify(alunoRepository).buscarAniversariantesHoje();

        verify(whatsAppService).enviarMensagem(
                eq("63999999999"),
                contains("Daniel")
        );

        verify(whatsAppService).enviarMensagem(
                eq("62988888888"),
                contains("Maria")
        );

        verify(whatsAppService, times(2))
                .enviarMensagem(anyString(), anyString());
    }

    @Test
    void naoDeveEnviarMensagemQuandoNaoExistirAniversariante() {

        when(alunoRepository.buscarAniversariantesHoje())
                .thenReturn(List.of());

        service.enviarMensagensAniversario();

        verify(alunoRepository).buscarAniversariantesHoje();

        verifyNoInteractions(whatsAppService);
    }

}