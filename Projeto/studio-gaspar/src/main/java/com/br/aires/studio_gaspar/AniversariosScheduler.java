package com.br.aires.studio_gaspar;

import com.br.aires.studio_gaspar.service.AniversarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AniversariosScheduler {

    private final AniversarioService aniversarioService;

    //@Scheduled(cron = "* * * * * *")
    public void executarEnvioAutomatico() {

        System.out.println("=====================================");
        System.out.println("Verificando aniversariantes...");
        System.out.println("=====================================");

        aniversarioService.enviarMensagensAniversario();
    }
}