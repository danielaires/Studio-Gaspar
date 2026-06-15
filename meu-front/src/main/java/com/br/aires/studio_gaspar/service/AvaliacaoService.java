package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.AvaliacaoFisica;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.br.aires.studio_gaspar.repository.AvaliacaoRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository repository;

    public List<AvaliacaoFisica> listar(){

        return repository.findAll();
    }

    public AvaliacaoFisica salvar(AvaliacaoFisica avaliacao){

        return repository.save(avaliacao);
    }

    public void excluir(Long id){

        repository.deleteById(id);
    }

}
