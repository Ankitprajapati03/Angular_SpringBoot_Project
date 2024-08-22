package com.student.demo.controllers;

import com.student.demo.dto.StudentDTO;
import com.student.demo.services.StudentService;
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

    @DeleteMapping("/{id}")
    public boolean deleteStudentById(@PathVariable Long id) {
        return studentService.deleteStudentById(id);
    }

    @PutMapping("/{id}")
    public StudentDTO updateStudentById(@PathVariable("id") Long studentId, @RequestBody StudentDTO studentDTO) {
        return studentService.updateStudentById(studentId, studentDTO);
    }
}
