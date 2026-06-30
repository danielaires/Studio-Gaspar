package com.br.aires.studio_gaspar.config;

import com.br.aires.studio_gaspar.entity.Usuario;
import com.br.aires.studio_gaspar.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println(
                "THREAD: "
                        + Thread.currentThread().getId()
                        + " | "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );

        String authHeader = request.getHeader("Authorization");

        System.out.println("AUTH HEADER: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            System.out.println("TOKEN RECEBIDO: " + token);
            System.out.println("TOKEN VÁLIDO? " + jwtService.isTokenValid(token));

            if (jwtService.isTokenValid(token)) {

                String email = jwtService.extractEmail(token);

                System.out.println("EMAIL: " + email);

                Usuario usuario = usuarioRepository
                        .findByEmail(email)
                        .orElse(null);

                System.out.println("USUÁRIO ENCONTRADO: " + (usuario != null));

                if (usuario != null) {

                    System.out.println("ROLE: " + usuario.getRole());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    AuthorityUtils.createAuthorityList(
                                            "ROLE_" + usuario.getRole()
                                    )
                            );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);

                    System.out.println("AUTENTICAÇÃO DEFINIDA");
                }
            }
        }

        filterChain.doFilter(request, response);

        System.out.println("STATUS DA RESPOSTA: " + response.getStatus());
    }
}