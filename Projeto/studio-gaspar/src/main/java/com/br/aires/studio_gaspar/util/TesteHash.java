package com.br.aires.studio_gaspar.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TesteHash {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String hashBanco =
                "COLE_O_HASH_GERADO_AGORA";

        System.out.println(
                encoder.matches(
                        "123456",
                        hashBanco
                )
        );
    }
}