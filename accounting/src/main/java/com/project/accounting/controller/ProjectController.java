package com.project.accounting.controller;

import com.project.accounting.dto.ProjectSummaryDTO;
import com.project.accounting.dto.ProjectWithPersonsDTO;
import com.project.accounting.entity.Person;
import com.project.accounting.entity.Project;
import com.project.accounting.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin("*")  // BASİT CORS
public class ProjectController {

    private final ProjectService projectService;

    @RequestMapping(method = RequestMethod.OPTIONS)
    public void options() {}

    @GetMapping
    public List<Project> getAllProjects() {
        System.out.println("📋 GET /api/projects çağrıldı");
        List<Project> projects = projectService.getAllProjects();
        System.out.println("✅ " + projects.size() + " project bulundu");
        return projects;
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.saveProject(project);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        project.setId(id);
        return projectService.saveProject(project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @GetMapping("/{id}/profit")
    public double getMonthlyProfit(@PathVariable Long id) {
        return projectService.calculateMonthlyProfit(id);
    }

    @GetMapping("/{id}/persons")
    public List<Person> getPersons(@PathVariable Long id) {
        return projectService.getPersonsByProject(id);
    }

    @GetMapping("/{id}/total-cost")
    public double getTotalCost(@PathVariable Long id) {
        return projectService.getTotalMonthlyCost(id);
    }

    @GetMapping("/filter")
    public List<Project> getByDateRange(@RequestParam LocalDate start, @RequestParam LocalDate end) {
        return projectService.getProjectsBetween(start, end);
    }

    @GetMapping("/{id}/duration")
    public long getDuration(@PathVariable Long id) {
        return projectService.getProjectDurationInMonths(id);
    }

    @GetMapping("/summary")
    public List<ProjectSummaryDTO> getSummary() {
        return projectService.getProjectSummaries();
    }

    @GetMapping("/with-persons")
    public List<ProjectWithPersonsDTO> getProjectsWithPersons() {
        return projectService.getProjectsWithPersons();
    }

}
