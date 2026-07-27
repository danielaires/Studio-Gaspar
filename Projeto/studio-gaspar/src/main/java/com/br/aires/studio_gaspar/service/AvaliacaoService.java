package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.AvaliacaoFisica;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.br.aires.studio_gaspar.repository.AvaliacaoRepository;

import java.time.LocalDate; // Certifique-se de que essa importação está aqui
import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository repository;

    public List<AvaliacaoFisica> listar(){
        return repository.findAll();
    }

    // --- MÉTODO SALVAR ATUALIZADO AQUI ---
    public AvaliacaoFisica salvar(AvaliacaoFisica avaliacao){
        // Se o frontend não enviar nenhuma data, o Java pega a data exata do dia atual
        if (avaliacao.getDataAvaliacao() == null) {
            avaliacao.setDataAvaliacao(LocalDate.now());
        }
        return repository.save(avaliacao);
    }

    public void excluir(Long id){
        repository.deleteById(id);
    }

    public List<AvaliacaoFisica> buscarPorAlunoId(Long alunoId) {
        return repository.findByAlunoId(alunoId);
    }

    public AvaliacaoFisica buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada com o ID: " + id));
    }

    public AvaliacaoFisica atualizarFotos(Long id, List<String> fotos) {
        if (fotos == null || fotos.size() > 4) {
            throw new IllegalArgumentException("Uma avaliação pode ter no máximo 4 fotos.");
        }

        AvaliacaoFisica avaliacao = buscarPorId(id);
        avaliacao.setFotos(new ArrayList<>(fotos));
        return repository.save(avaliacao);
    }

}
