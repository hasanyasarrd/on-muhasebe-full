package com.project.accounting.controller;

import com.project.accounting.dto.AssignmentResponseDTO;
import com.project.accounting.dto.ProjectPersonDTO;
import com.project.accounting.entity.Person;
import com.project.accounting.entity.Project;
import com.project.accounting.entity.ProjectPerson;
import com.project.accounting.repository.PersonRepository;
import com.project.accounting.repository.ProjectPersonRepository;
import com.project.accounting.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/project-persons")
@CrossOrigin("*")
public class ProjectPersonController {

    private final ProjectRepository projectRepository;
    private final PersonRepository personRepository;
    private final ProjectPersonRepository projectPersonRepository;

    public ProjectPersonController(ProjectRepository projectRepository,
                                   PersonRepository personRepository,
                                   ProjectPersonRepository projectPersonRepository) {
        this.projectRepository = projectRepository;
        this.personRepository = personRepository;
        this.projectPersonRepository = projectPersonRepository;
    }

    // OPTIONS method'u da ekle (preflight request için)
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> options() {
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResponseDTO>> getAllProjectPersons() {
        try {
            List<ProjectPerson> projectPersons = projectPersonRepository.findAll();
            List<AssignmentResponseDTO> dtos = projectPersons.stream().map(pp ->
                    new AssignmentResponseDTO(
                            pp.getId(),
                            pp.getPerson().getId(),
                            pp.getProject().getId(),
                            pp.getPerson().getName(),
                            pp.getProject().getName()
                    )
            ).toList();

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }


    @PostMapping
    public ResponseEntity<Map<String, Object>> assignPersonToProject(@RequestBody ProjectPersonDTO dto) {
        try {
            System.out.println("🚀 Atama isteği alındı: PersonId=" + dto.getPersonId() + ", ProjectId=" + dto.getProjectId());

            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + dto.getProjectId()));

            Person person = personRepository.findById(dto.getPersonId())
                    .orElseThrow(() -> new RuntimeException("Person not found with id: " + dto.getPersonId()));

            ProjectPerson pp = ProjectPerson.builder()
                    .project(project)
                    .person(person)
                    .build();

            ProjectPerson saved = projectPersonRepository.save(pp);
            System.out.println("✅ Atama kaydedildi: ID = " + saved.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Kişi projeye başarıyla ilişkilendirildi");
            response.put("id", saved.getId());
            response.put("personName", person.getName());
            response.put("projectName", project.getName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ POST /api/project-persons hatası: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProjectPerson(@PathVariable Long id) {
        try {
            projectPersonRepository.deleteById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Atama başarıyla silindi");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}