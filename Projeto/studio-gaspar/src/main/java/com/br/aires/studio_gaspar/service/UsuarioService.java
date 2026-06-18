package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Usuario;
import com.br.aires.studio_gaspar.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public Usuario salvar(Usuario usuario) {

        usuario.setSenha(
                passwordEncoder.encode(
                        usuario.getSenha()
                )
        );

        return repository.save(usuario);
    }
    public List<Usuario> listar() {

        return repository.findAll();

    }

    public void excluir(Long id) {

        repository.deleteById(id);

    }
}