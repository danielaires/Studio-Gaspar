package com.br.aires.studio_gaspar.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.*;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WhatsAppServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private WhatsAppService service;

    @BeforeEach
    void setup() {

        ReflectionTestUtils.setField(
                service,
                "url",
                "http://localhost:8081"
        );

        ReflectionTestUtils.setField(
                service,
                "apiKey",
                "123456"
        );

        ReflectionTestUtils.setField(
                service,
                "instance",
                "studiogaspar"
        );
    }

    @Test
    void deveEnviarMensagem() {

        ResponseEntity<String> response =
                new ResponseEntity<>(
                        "Mensagem enviada",
                        HttpStatus.OK
                );

        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)
        )).thenReturn(response);

        String resultado = service.enviarMensagem(
                "(63)99999-9999",
                "Olá"
        );

        assertEquals("Mensagem enviada", resultado);

        verify(restTemplate).exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)
        );
    }

    @Test
    void deveRetornarErroQuandoApiFalhar() {

        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)
        )).thenThrow(new RuntimeException("API Offline"));

        String retorno =
                service.enviarMensagem(
                        "63999999999",
                        "Teste"
                );

        assertTrue(retorno.contains("Erro ao enviar mensagem"));
    }

    @Test
    void deveAdicionarCodigoPais() {

        ResponseEntity<String> response =
                new ResponseEntity<>(
                        "OK",
                        HttpStatus.OK
                );

        when(restTemplate.exchange(
                anyString(),
                any(),
                any(),
                eq(String.class)
        )).thenReturn(response);

        String resultado =
                service.enviarMensagem(
                        "63999999999",
                        "Teste"
                );

        assertEquals("OK", resultado);

        verify(restTemplate).exchange(
                contains("/message/sendText/studiogaspar"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(String.class)
        );
    }

}