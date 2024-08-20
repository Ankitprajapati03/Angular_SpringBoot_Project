package com.student.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDTO {
    private Long id;
    private String name;
    private Integer age;
    private String gender;
    private String rollNumber;
    private String course;
    private String semester;
    private String stream;
    private String studentPhoto;
    private String additionalDocument;
}
