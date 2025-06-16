package com.project.accounting.repository;

import com.project.accounting.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStartDateAfterAndEndDateBefore(LocalDate start, LocalDate end);


}
