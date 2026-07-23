package com.br.aires.studio_gaspar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StudioGasparApplication {

	public static void main(String[] args) {

		SpringApplication.run(StudioGasparApplication.class, args);
	}

}
