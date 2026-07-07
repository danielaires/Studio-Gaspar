package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.entity.Usuario;
import com.br.aires.studio_gaspar.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService service;

    @Test
    void deveSalvarUsuario() {

        Usuario usuario = new Usuario();
        usuario.setNome("Daniel");
        usuario.setEmail("daniel@email.com");
        usuario.setSenha("123456");

        when(passwordEncoder.encode("123456"))
                .thenReturn("senhaCriptografada");

        when(repository.save(any(Usuario.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Usuario resultado = service.salvar(usuario);

        assertEquals("senhaCriptografada", resultado.getSenha());

        verify(passwordEncoder).encode("123456");
        verify(repository).save(usuario);
    }

    @Test
    void deveListarUsuarios() {

        Usuario usuario = new Usuario();
        usuario.setNome("Daniel");

        when(repository.findAll())
                .thenReturn(List.of(usuario));

        List<Usuario> lista = service.listar();

        assertEquals(1, lista.size());
        assertEquals("Daniel", lista.get(0).getNome());

        verify(repository).findAll();
    }

    @Test
    void deveRetornarListaVazia() {

        when(repository.findAll())
                .thenReturn(List.of());

        List<Usuario> lista = service.listar();

        assertTrue(lista.isEmpty());

        verify(repository).findAll();
    }

    @Test
    void deveBuscarUsuarioPorId() {

        Usuario usuario = new Usuario();
        usuario.setId(1L);

        when(repository.findById(1L))
                .thenReturn(Optional.of(usuario));

        Usuario resultado = service.buscarPorId(1L);

        assertEquals(1L, resultado.getId());

        verify(repository).findById(1L);
    }

    @Test
    void deveLancarExcecaoQuandoUsuarioNaoExiste() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.buscarPorId(1L)
        );

        assertEquals("Usuário não encontrado", exception.getMessage());

        verify(repository).findById(1L);
    }

    @Test
    void deveAtualizarUsuarioComNovaSenha() {

        Usuario existente = new Usuario();
        existente.setId(1L);

        Usuario atualizado = new Usuario();
        atualizado.setNome("Daniel");
        atualizado.setEmail("novo@email.com");
        atualizado.setRole("ADMIN");
        atualizado.setSenha("novaSenha");

        when(repository.findById(1L))
                .thenReturn(Optional.of(existente));

        when(passwordEncoder.encode("novaSenha"))
                .thenReturn("senhaNovaCriptografada");

        when(repository.save(any(Usuario.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Usuario resultado = service.atualizar(1L, atualizado);

        assertEquals("Daniel", resultado.getNome());
        assertEquals("novo@email.com", resultado.getEmail());
        assertEquals("ADMIN", resultado.getRole());
        assertEquals("senhaNovaCriptografada", resultado.getSenha());

        verify(passwordEncoder).encode("novaSenha");
        verify(repository).save(any(Usuario.class));
    }

    @Test
    void deveAtualizarUsuarioSemAlterarSenha() {

        Usuario existente = new Usuario();
        existente.setId(1L);
        existente.setSenha("senhaAntiga");

        Usuario atualizado = new Usuario();
        atualizado.setNome("Daniel");
        atualizado.setEmail("novo@email.com");
        atualizado.setRole("USER");
        atualizado.setSenha("");

        when(repository.findById(1L))
                .thenReturn(Optional.of(existente));

        when(repository.save(any(Usuario.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Usuario resultado = service.atualizar(1L, atualizado);

        assertEquals("senhaAntiga", resultado.getSenha());

        verify(passwordEncoder, never()).encode(any());
        verify(repository).save(any(Usuario.class));
    }

    @Test
    void deveLancarExcecaoAoAtualizarUsuarioInexistente() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.atualizar(1L, new Usuario())
        );

        assertEquals("Usuário não encontrado", exception.getMessage());

        verify(repository).findById(1L);
        verify(repository, never()).save(any());
    }

    @Test
    void deveExcluirUsuario() {

        doNothing().when(repository).deleteById(1L);

        assertDoesNotThrow(() -> service.excluir(1L));

        verify(repository).deleteById(1L);
    }
}