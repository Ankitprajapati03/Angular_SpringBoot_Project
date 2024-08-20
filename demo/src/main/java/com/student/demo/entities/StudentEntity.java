package com.student.demo.entities;

import jakarta.persistence.*;
import jdk.jfr.Enabled;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Entity
@Table(name="students")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentEntity {
 @Id
 @GeneratedValue(strategy = GenerationType.AUTO)
 private Long id;
 private String name;
 private Integer age;
 private String gender;
 private String rollNumber;
 private String course;
 private String semester;
 private String stream;

 @Column(name = "studentPhoto")
 private String studentPhoto;

 @Column(name = "additionalDocument")
 private String additionalDocument;
}
