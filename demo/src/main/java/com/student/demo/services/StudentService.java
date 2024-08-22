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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;

    @Value("${file.upload-dir:D:/Angular_SpringBoot_Project/uploads}")
    private String uploadDir;

    public StudentService(StudentRepository studentRepository, ModelMapper modelMapper) {
        this.studentRepository = studentRepository;
        this.modelMapper = modelMapper;
    }

    public StudentDTO createNewStudent(StudentDTO studentDTO, MultipartFile studentPhoto, MultipartFile additionalDocument) {
        StudentEntity studentEntity = modelMapper.map(studentDTO, StudentEntity.class);
        Path photoPath = null;
        Path docPath = null;

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            if (studentPhoto != null && !studentPhoto.isEmpty()) {
                String photoFileName = StringUtils.cleanPath(studentPhoto.getOriginalFilename());
                photoPath = uploadPath.resolve(photoFileName);
                Files.copy(studentPhoto.getInputStream(), photoPath);
                studentEntity.setStudentPhoto(photoPath.toString());
            }
            if (additionalDocument != null && !additionalDocument.isEmpty()) {
                String docFileName = StringUtils.cleanPath(additionalDocument.getOriginalFilename());
                docPath = uploadPath.resolve(docFileName);
                Files.copy(additionalDocument.getInputStream(), docPath);
                studentEntity.setAdditionalDocument(docPath.toString());
            }

            studentEntity = studentRepository.save(studentEntity);
            return modelMapper.map(studentEntity, StudentDTO.class);

        } catch (IOException e) {
            if (photoPath != null) {
                try {
                    Files.deleteIfExists(photoPath);
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
            if (docPath != null) {
                try {
                    Files.deleteIfExists(docPath);
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
            throw new RuntimeException("Failed to save student", e);
        }
    }

    public StudentDTO getStudentById(Long id) {
        StudentEntity studentEntity = studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
        return modelMapper.map(studentEntity, StudentDTO.class);
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(student -> modelMapper.map(student, StudentDTO.class))
                .collect(Collectors.toList());
    }

    public boolean deleteStudentById(Long id) {
        Optional<StudentEntity> studentOpt = studentRepository.findById(id);
        if (studentOpt.isPresent()) {
            StudentEntity studentEntity = studentOpt.get();

            try {
                if (studentEntity.getStudentPhoto() != null) {
                    Files.deleteIfExists(Paths.get(studentEntity.getStudentPhoto()));
                }
                if (studentEntity.getAdditionalDocument() != null) {
                    Files.deleteIfExists(Paths.get(studentEntity.getAdditionalDocument()));
                }
                studentRepository.deleteById(id);
                return true;
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete student files", e);
            }
        } else {
            throw new RuntimeException("Student not found");
        }
    }

    public StudentDTO updateStudentById(Long studentId, StudentDTO studentDTO) {
        StudentEntity studentEntity = studentRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        modelMapper.map(studentDTO, studentEntity);
        studentRepository.save(studentEntity);
        return modelMapper.map(studentEntity, StudentDTO.class);
    }
}
