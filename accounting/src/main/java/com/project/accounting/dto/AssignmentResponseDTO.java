package com.project.accounting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AssignmentResponseDTO {
    private Long id;
    private Long personId;
    private Long projectId;
    private String personName;
    private String projectName;
}
