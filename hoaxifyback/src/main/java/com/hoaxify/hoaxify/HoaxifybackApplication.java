package com.hoaxify.hoaxify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class HoaxifybackApplication {

	public static void main(String[] args) {
		SpringApplication.run(HoaxifybackApplication.class, args);
	}

}
