package com.project.accounting.service;

import com.project.accounting.dto.ProjectSummaryDTO;
import com.project.accounting.dto.ProjectWithPersonsDTO;
import com.project.accounting.entity.Person;
import com.project.accounting.entity.Project;
import com.project.accounting.entity.ProjectPerson;
import com.project.accounting.repository.PersonRepository;
import com.project.accounting.repository.ProjectPersonRepository;
import com.project.accounting.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectPersonRepository projectPersonRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Person> getPersonsByProject(Long projectId) {
        return projectPersonRepository.findByProjectId(projectId)
                .stream().map(ProjectPerson::getPerson).toList();
    }

    public double getTotalMonthlyCost(Long projectId) {
        return projectPersonRepository.findByProjectId(projectId)
                .stream().mapToDouble(pp -> pp.getPerson().getMonthlyCost()).sum();
    }

    public List<Project> getProjectsBetween(LocalDate start, LocalDate end) {
        return projectRepository.findByStartDateAfterAndEndDateBefore(start, end);
    }

    public long getProjectDurationInMonths(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return ChronoUnit.MONTHS.between(project.getStartDate(), project.getEndDate());
    }

    public List<ProjectSummaryDTO> getProjectSummaries() {
        return projectRepository.findAll().stream().map(project -> {
            double cost = projectPersonRepository.findByProjectId(project.getId())
                    .stream().mapToDouble(pp -> pp.getPerson().getMonthlyCost()).sum();
            double profit = project.getMonthlyIncome() - cost;
            return new ProjectSummaryDTO(project.getName(), project.getMonthlyIncome(), cost, profit);
        }).toList();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public double calculateMonthlyProfit(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        double totalCost = projectPersonRepository.findByProjectId(projectId)
                .stream().mapToDouble(pp -> pp.getPerson().getMonthlyCost()).sum();
        return project.getMonthlyIncome() - totalCost;
    }

    // 🆕 DTO ile detaylı listeleme
    public List<ProjectWithPersonsDTO> getProjectsWithPersons() {
        return projectRepository.findAll().stream().map(project -> {
            List<String> names = projectPersonRepository.findByProjectId(project.getId())
                    .stream().map(pp -> pp.getPerson().getName()).toList();
            return new ProjectWithPersonsDTO(
                    project.getId(),
                    project.getName(),
                    project.getStartDate(),
                    project.getEndDate(),
                    project.getMonthlyIncome(),
                    names
            );
        }).toList();
    }
}
