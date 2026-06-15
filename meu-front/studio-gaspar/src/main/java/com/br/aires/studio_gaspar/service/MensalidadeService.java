package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Mensalidade;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.br.aires.studio_gaspar.repository.MensalidadeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MensalidadeService {

    private final MensalidadeRepository repository;

    public List<Mensalidade> listar(){

        return repository.findAll();
    }

    public Mensalidade salvar(Mensalidade mensalidade){

        return repository.save(mensalidade);
    }

}
