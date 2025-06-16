package com.project.accounting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class ProjectWithPersonsDTO {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private double monthlyIncome;
    private List<String> personNames;
}
