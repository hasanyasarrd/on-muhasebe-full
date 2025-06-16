package com.project.accounting.controller;

import com.project.accounting.entity.Person;
import com.project.accounting.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
@RequiredArgsConstructor
@CrossOrigin("*")  // BASİT CORS
public class PersonController {

    private final PersonService personService;

    @RequestMapping(method = RequestMethod.OPTIONS)
    public void options() {}

    @GetMapping
    public List<Person> getAllPersons() {
        System.out.println("📋 GET /api/persons çağrıldı");
        List<Person> persons = personService.getAllPersons();
        System.out.println("✅ " + persons.size() + " person bulundu");
        return persons;
    }

    @GetMapping("/{id}")
    public Person getPersonById(@PathVariable Long id) {
        return personService.getPersonById(id);
    }

    @PostMapping
    public Person createPerson(@RequestBody Person person) {
        return personService.savePerson(person);
    }

    @PutMapping("/{id}")
    public Person updatePerson(@PathVariable Long id, @RequestBody Person person) {
        person.setId(id);
        return personService.savePerson(person);
    }

    @DeleteMapping("/{id}")
    public void deletePerson(@PathVariable Long id) {
        personService.deletePerson(id);
    }
}