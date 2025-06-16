package com.project.accounting;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.project.accounting.entity.Person;
import com.project.accounting.entity.Project;
import com.project.accounting.entity.ProjectPerson;
import com.project.accounting.repository.PersonRepository;
import com.project.accounting.repository.ProjectPersonRepository;
import com.project.accounting.repository.ProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


import java.time.LocalDate;
import java.util.List;

// Spring Boot uygulamasını başlatan anotasyon


@SpringBootApplication
public class AccountingApplication {

	public static void main(String[] args) {
		SpringApplication.run(AccountingApplication.class, args);
	}
}
