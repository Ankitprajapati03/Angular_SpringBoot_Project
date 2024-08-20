package com.student.demo.services;

import com.student.demo.dto.StudentDTO;
import com.student.demo.entities.StudentEntity;
import com.student.demo.repositories.StudentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;

    // Read the base directory from the configuration file
    @Value("${file.upload-dir:D:/Angular_SpringBoot_Project/uploads}")
    private String uploadDir;

    public StudentService(StudentRepository studentRepository, ModelMapper modelMapper) {
        this.studentRepository = studentRepository;
        this.modelMapper = modelMapper;
    }

    public StudentDTO createNewStudent(StudentDTO studentDTO, MultipartFile studentPhoto, MultipartFile additionalDocument) {
        StudentEntity studentEntity = modelMapper.map(studentDTO, StudentEntity.class);

        try {
            // Resolve and create the upload directory
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Handle student photo
            if (studentPhoto != null && !studentPhoto.isEmpty()) {
                String photoFileName = StringUtils.cleanPath(studentPhoto.getOriginalFilename());
                Path photoPath = uploadPath.resolve(photoFileName);
                Files.copy(studentPhoto.getInputStream(), photoPath);
                studentEntity.setStudentPhoto(photoPath.toString());
            }

            // Handle additional document
            if (additionalDocument != null && !additionalDocument.isEmpty()) {
                String docFileName = StringUtils.cleanPath(additionalDocument.getOriginalFilename());
                Path docPath = uploadPath.resolve(docFileName);
                Files.copy(additionalDocument.getInputStream(), docPath);
                studentEntity.setAdditionalDocument(docPath.toString());
            }

        } catch (IOException e) {
            e.printStackTrace(); // Handle the exception, or rethrow as needed
            // Consider creating a custom exception to handle file upload issues
        }

        studentEntity = studentRepository.save(studentEntity);
        return modelMapper.map(studentEntity, StudentDTO.class);
    }

    public StudentDTO getStudentId(Long id) {
        StudentEntity studentEntity = studentRepository.findById(id).orElseThrow();
        return modelMapper.map(studentEntity, StudentDTO.class);
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(student -> modelMapper.map(student, StudentDTO.class))
                .collect(Collectors.toList());
    }

    public boolean deleteStudentById(Long id) {
        studentRepository.deleteById(id);
        return true;
    }

    public StudentDTO updateStudentById(Long studentId, StudentDTO studentDTO) {
        StudentEntity studentEntity = studentRepository.findById(studentId).orElseThrow();
        modelMapper.map(studentDTO, studentEntity);
        studentRepository.save(studentEntity);
        return modelMapper.map(studentEntity, StudentDTO.class);
    }
}
