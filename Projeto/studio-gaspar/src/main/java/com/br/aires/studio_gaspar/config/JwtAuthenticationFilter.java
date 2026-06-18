package com.br.aires.studio_gaspar.config;

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

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println(
                "REQUISICAO: "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );

        String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "AUTH HEADER: "
                        + authHeader
        );

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            String token =
                    authHeader.substring(7);

            System.out.println(
                    "TOKEN RECEBIDO: "
                            + token
            );

            if (jwtService.isTokenValid(token)) {

                String email =
                        jwtService.extractEmail(token);

                System.out.println(
                        "USUARIO AUTENTICADO: "
                                + email
                );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                AuthorityUtils.NO_AUTHORITIES
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}