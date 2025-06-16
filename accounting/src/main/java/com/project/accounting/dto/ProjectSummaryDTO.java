package com.project.accounting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectSummaryDTO {
    private String projectName;
    private double monthlyIncome;
    private double monthlyCost;
    private double monthlyProfit;
}
