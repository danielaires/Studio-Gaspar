package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.entity.Aluno;
import com.br.aires.studio_gaspar.repository.AlunoRepository;
import com.br.aires.studio_gaspar.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class WhatsAppController {

    private final WhatsAppService whatsappService;
    private final AlunoRepository alunoRepository;

    @PostMapping("/enviar/{id}")
    public ResponseEntity<String> enviarMensagem(
            @PathVariable Long id,
            @RequestParam String mensagem
    ) {

        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        String retorno = whatsappService.enviarMensagem(
                aluno.getTelefone(),
                mensagem
        );

        return ResponseEntity.ok(retorno);
    }
}
