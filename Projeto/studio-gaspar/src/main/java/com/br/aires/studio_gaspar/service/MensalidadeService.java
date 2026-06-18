package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Mensalidade;
import com.br.aires.studio_gaspar.repository.MensalidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MensalidadeService {

    private final MensalidadeRepository repository;

    public List<Mensalidade> listar() {

        atualizarMensalidadesVencidas();

        return repository.findAll();
    }

    public Mensalidade salvar(Mensalidade mensalidade) {
        return repository.save(mensalidade);
    }

    public List<Mensalidade> listarPorAluno(Long id) {

        atualizarMensalidadesVencidas();

        return repository.findByAlunoId(id);
    }

    public Mensalidade marcarComoPago(Long id) {

        Mensalidade mensalidade = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensalidade não encontrada"));

        mensalidade.setStatus("PAGO");
        mensalidade.setPagamento(LocalDate.now());

        return repository.save(mensalidade);
    }

    private void atualizarMensalidadesVencidas() {

        LocalDate hoje = LocalDate.now();

        System.out.println("================================");
        System.out.println("VERIFICANDO MENSALIDADES");
        System.out.println("DATA DE HOJE: " + hoje);
        System.out.println("================================");

        List<Mensalidade> mensalidades = repository.findAll();

        for (Mensalidade mensalidade : mensalidades) {

            System.out.println(
                    "ID=" + mensalidade.getId()
                            + " STATUS=[" + mensalidade.getStatus() + "]"
                            + " VENCIMENTO=" + mensalidade.getVencimento()
            );

            if (mensalidade.getStatus() != null
                    && "PENDENTE".equalsIgnoreCase(mensalidade.getStatus().trim())
                    && mensalidade.getVencimento() != null
                    && mensalidade.getVencimento().isBefore(hoje)) {

                System.out.println(
                        "ATUALIZANDO PARA VENCIDO -> ID "
                                + mensalidade.getId()
                );

                mensalidade.setStatus("VENCIDO");

                repository.save(mensalidade);
            }
        }
    }
}