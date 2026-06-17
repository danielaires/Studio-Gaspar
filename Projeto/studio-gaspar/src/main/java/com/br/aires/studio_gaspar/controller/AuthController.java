package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.config.JwtService;
import com.br.aires.studio_gaspar.dto.LoginRequest;
import com.br.aires.studio_gaspar.dto.LoginResponse;
import com.br.aires.studio_gaspar.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        return usuarioRepository.findByEmail(request.getEmail())
                .filter(usuario ->
                        passwordEncoder.matches(
                                request.getSenha(),
                                usuario.getSenha()
                        )
                )
                .map(usuario -> ResponseEntity.ok(
                        new LoginResponse(
                                jwtService.generateToken(
                                        usuario.getEmail()
                                )
                        )
                ))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}