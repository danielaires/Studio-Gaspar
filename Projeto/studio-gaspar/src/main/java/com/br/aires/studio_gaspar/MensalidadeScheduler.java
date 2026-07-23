package com.br.aires.studio_gaspar;

import com.br.aires.studio_gaspar.service.MensalidadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MensalidadeScheduler {

    private final MensalidadeService mensalidadeService;

    @Scheduled(cron = "0 0 0 * * *") // Executa todos os dias à meia-noite
    public void atualizarMensalidades() {

        System.out.println("================================");
        System.out.println("ATUALIZANDO MENSALIDADES...");
        System.out.println("================================");

        mensalidadeService.atualizarMensalidadesVencidas();
    }
}