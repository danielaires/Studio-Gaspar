package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.entity.Aluno;
import com.br.aires.studio_gaspar.entity.Mensalidade;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.br.aires.studio_gaspar.repository.AlunoRepository;
import com.br.aires.studio_gaspar.repository.MensalidadeRepository;

import java.util.List;

@RestController
@RequestMapping("/relatorios")
@RequiredArgsConstructor
public class RelatorioController {

    private final AlunoRepository alunoRepository;
    private final MensalidadeRepository mensalidadeRepository;

    @GetMapping("/ativos")
    public List<Aluno> ativos(){

        return alunoRepository.findByAtivo(true);
    }

    @GetMapping("/inativos")
    public List<Aluno> inativos(){

        return alunoRepository.findByAtivo(false);
    }

    @GetMapping("/vencidos")
    public List<Mensalidade> vencidos(){

        return mensalidadeRepository.findByStatusIn(List.of("ATRASADO", "VENCIDO"));
    }

    @GetMapping("/pagos")
    public List<Mensalidade> pagos(){

        return mensalidadeRepository.findByStatus("PAGO");
    }

}
