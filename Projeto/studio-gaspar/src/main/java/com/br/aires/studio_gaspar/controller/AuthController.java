package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.config.JwtService;
import com.br.aires.studio_gaspar.dto.LoginRequest;
import com.br.aires.studio_gaspar.dto.LoginResponse;
import com.br.aires.studio_gaspar.entity.Usuario;
import com.br.aires.studio_gaspar.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        Usuario usuario = usuarioRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));

        System.out.println("EMAIL: " + request.getEmail());

        boolean senhaValida =
                passwordEncoder.matches(
                        request.getSenha(),
                        usuario.getSenha()
                );

        System.out.println("SENHA VALIDA? " + senhaValida);

        if (!senhaValida) {
            throw new RuntimeException("Senha inválida");
        }

        String token =
                jwtService.generateToken(
                        usuario.getEmail()
                );

        System.out.println("TOKEN GERADO: " + token);

        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        usuario.getNome()
                )
        );
    }
}