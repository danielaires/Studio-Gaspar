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
        return repository.findAll();
    }

    public Mensalidade salvar(Mensalidade mensalidade) {
        return repository.save(mensalidade);
    }

    public List<Mensalidade> listarPorAluno(Long id) {
        return repository.findByAlunoId(id);
    }

    public Mensalidade marcarComoPago(Long id) {

        Mensalidade mensalidade = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensalidade não encontrada"));

        mensalidade.setStatus("PAGO");
        mensalidade.setPagamento(LocalDate.now());

        return repository.save(mensalidade);
    }

}