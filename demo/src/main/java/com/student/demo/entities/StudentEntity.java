package com.student.demo.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="students", uniqueConstraints = @UniqueConstraint(columnNames = "rollNumber"))
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
 // Store the Base64-encoded image as a string


 @Column(name = "studentPhoto",length = 7000000)
 private String studentPhoto;

 @Column(name = "additionalDocument",length = 7000000)
 private String additionalDocument;




 // Getters and setters.

 public String getStudentPhotoBase64() {
  return studentPhoto;
 }

 public void setStudentPhotoBase64(String studentPhotoBase64) {
  this.studentPhoto = studentPhotoBase64;
 }

 public String getAdditionalDocumentBase64() {
  return additionalDocument;
 }

 public void setAdditionalDocumentBase64(String additionalDocumentBase64) {
  this.additionalDocument = additionalDocumentBase64;
 }
}
