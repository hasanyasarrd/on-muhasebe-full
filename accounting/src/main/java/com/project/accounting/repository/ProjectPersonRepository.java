package com.project.accounting.repository;

import com.project.accounting.entity.ProjectPerson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectPersonRepository extends JpaRepository<ProjectPerson, Long> {
    List<ProjectPerson> findByProjectId(Long projectId);
}
