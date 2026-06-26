package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Aluno;
import com.br.aires.studio_gaspar.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AniversarioService {

    private final AlunoRepository alunoRepository;
    private final WhatsAppService whatsAppService;

    public void enviarMensagensAniversario() {

        System.out.println("Entrou no AniversarioService");

        List<Aluno> aniversariantes =
                alunoRepository.buscarAniversariantesHoje();

        System.out.println("Quantidade encontrada: " + aniversariantes.size());

        if (aniversariantes.isEmpty()) {
            System.out.println("Nenhum aniversariante hoje.");
            return;
        }

        for (Aluno aluno : aniversariantes) {

            System.out.println("Enviando para: " + aluno.getNome());

            String mensagem = """
                🎉 Feliz aniversário, %s!

                Toda a equipe do Studio Gaspar deseja muita saúde, felicidade e conquistas.

                Que seu novo ciclo seja repleto de energia e excelentes treinos!

                Parabéns! 🥳💜
                """
                    .formatted(aluno.getNome());

            whatsAppService.enviarMensagem(
                    aluno.getTelefone(),
                    mensagem
            );

            System.out.println("Mensagem enviada para: " + aluno.getNome());
        }
    }
}