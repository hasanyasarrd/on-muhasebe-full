package com.project.accounting.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_persons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "person_id")
    @JsonBackReference
    private Person person;


    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonManagedReference
    private Project project;


}
