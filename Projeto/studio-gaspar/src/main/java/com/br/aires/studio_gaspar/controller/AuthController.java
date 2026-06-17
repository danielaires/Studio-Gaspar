package com.br.aires.studio_gaspar.controller;

import com.br.aires.studio_gaspar.config.JwtService;
import com.br.aires.studio_gaspar.dto.LoginRequest;
import com.br.aires.studio_gaspar.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String hashNovo =
                encoder.encode("123456");

        System.out.println("Hash novo: " + hashNovo);

        System.out.println(
                "Teste hash novo: " +
                        encoder.matches("123456", hashNovo)
        );

        return ResponseEntity.ok().build();
    }
}