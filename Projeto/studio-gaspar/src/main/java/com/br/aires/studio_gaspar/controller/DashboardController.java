package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.dto.DashboardDTO;
import com.br.aires.studio_gaspar.entity.Aluno;
import com.br.aires.studio_gaspar.entity.Mensalidade;
import com.br.aires.studio_gaspar.repository.AlunoRepository;
import com.br.aires.studio_gaspar.repository.MensalidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AlunoRepository alunoRepository;
    private final MensalidadeRepository mensalidadeRepository;

    @GetMapping
    public DashboardDTO dashboard() {

        List<Aluno> alunos = alunoRepository.findAll();
        List<Mensalidade> mensalidades = mensalidadeRepository.findAll();

        long alunosAtivos = alunos.stream()
                .filter(a -> Boolean.TRUE.equals(a.getAtivo()))
                .count();

        long alunosInativos = alunos.stream()
                .filter(a -> Boolean.FALSE.equals(a.getAtivo()))
                .count();

        long mensalidadesPagas = mensalidades.stream()
                .filter(m -> "PAGO".equalsIgnoreCase(m.getStatus()))
                .count();

        long mensalidadesVencidas = mensalidades.stream()
                .filter(m -> "VENCIDO".equalsIgnoreCase(m.getStatus()))
                .count();

        BigDecimal valorRecebido = mensalidades.stream()
                .filter(m -> "PAGO".equalsIgnoreCase(m.getStatus()))
                .map(Mensalidade::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal valorPendente = mensalidades.stream()
                .filter(m -> "VENCIDO".equalsIgnoreCase(m.getStatus()))
                .map(Mensalidade::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardDTO(
                alunosAtivos,
                alunosInativos,
                mensalidadesPagas,
                mensalidadesVencidas,
                valorRecebido.doubleValue(),
                valorPendente.doubleValue()
        );
    }
}