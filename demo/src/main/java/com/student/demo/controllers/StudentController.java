package com.student.demo.controllers;

import com.student.demo.dto.StudentDTO;
import com.student.demo.services.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public StudentDTO createNewStudent(
            @RequestParam("name") String name,
            @RequestParam("age") Integer age,
            @RequestParam("gender") String gender,
            @RequestParam("rollNumber") String rollNumber,
            @RequestParam("course") String course,
            @RequestParam("semester") String semester,
            @RequestParam("stream") String stream,
            @RequestParam("studentPhoto") MultipartFile studentPhoto,
            @RequestParam("additionalDocument") MultipartFile additionalDocument) {

        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setName(name);
        studentDTO.setAge(age);
        studentDTO.setGender(gender);
        studentDTO.setRollNumber(rollNumber);
        studentDTO.setCourse(course);
        studentDTO.setSemester(semester);
        studentDTO.setStream(stream);

        return studentService.createNewStudent(studentDTO, studentPhoto, additionalDocument);
    }

    @GetMapping
    public List<StudentDTO> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public StudentDTO getStudentById(@PathVariable("id") Long studentId) {
        return studentService.getStudentById(studentId);
    }

    @DeleteMapping("/{rollNumber}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String rollNumber) {
        try {
            studentService.deleteStudentByRollNumber(rollNumber);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
//Student record Updation Logi
    @PutMapping("/{rollNumber}")
    public ResponseEntity<StudentDTO> updateStudentByRollNumber(
            @PathVariable("rollNumber") String rollNumber,
            @RequestBody StudentDTO studentDTO) {

        try {
            StudentDTO updatedStudent = studentService.updateStudentByRollNumber(rollNumber, studentDTO);
            return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
