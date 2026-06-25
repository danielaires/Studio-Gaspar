package com.br.aires.studio_gaspar.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {

    @Value("${evolution.url}")
    private String url;

    @Value("${evolution.apikey}")
    private String apiKey;

    @Value("${evolution.instance}")
    private String instance;

    private final RestTemplate restTemplate = new RestTemplate();

    public void enviarMensagem(String telefone, String mensagem) {

        String numero = telefone.replaceAll("\\D", "");

        if (!numero.startsWith("55")) {
            numero = "55" + numero;
        }

        String endpoint =
                url + "/message/sendText/" + instance;

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("number", numero);
        body.put("text", mensagem);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        restTemplate.exchange(
                endpoint,
                HttpMethod.POST,
                request,
                String.class
        );
    }
}