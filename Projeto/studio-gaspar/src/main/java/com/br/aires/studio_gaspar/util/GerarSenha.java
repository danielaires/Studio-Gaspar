package com.br.aires.studio_gaspar.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GerarSenha {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String senha = "123456";

        String hash = encoder.encode(senha);

        System.out.println("HASH:");
        System.out.println(hash);

        System.out.println();

        System.out.println("VALIDACAO:");
        System.out.println(
                encoder.matches(
                        senha,
                        hash
                )
        );
    }
}