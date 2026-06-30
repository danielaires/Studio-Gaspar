package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.config.JwtService;
import com.br.aires.studio_gaspar.dto.LoginRequest;
import com.br.aires.studio_gaspar.dto.LoginResponse;
import com.br.aires.studio_gaspar.dto.RefreshTokenRequest;
import com.br.aires.studio_gaspar.dto.RefreshTokenResponse;
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

        boolean senhaValida = passwordEncoder.matches(
                request.getSenha(),
                usuario.getSenha()
        );

        if (!senhaValida) {
            throw new RuntimeException("Senha inválida");
        }

        String accessToken = jwtService.generateAccessToken(
                usuario.getEmail()
        );

        String refreshToken = jwtService.generateRefreshToken(
                usuario.getEmail()
        );

        return ResponseEntity.ok(
                new LoginResponse(
                        accessToken,
                        refreshToken,
                        usuario.getNome(),
                        usuario.getEmail(),
                        usuario.getRole()
                )
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(
            @RequestBody RefreshTokenRequest request) {

        String refreshToken = request.getRefreshToken();

        if (!jwtService.isTokenValid(refreshToken)) {
            return ResponseEntity.status(401).build();
        }

        String email = jwtService.extractEmail(refreshToken);

        Usuario usuario = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));

        String novoAccessToken = jwtService.generateAccessToken(
                usuario.getEmail()
        );

        return ResponseEntity.ok(
                new RefreshTokenResponse(novoAccessToken)
        );
    }
}