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
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;

    // Defining file path where to upload files
    @Value("${file.upload-dir:D:/Angular_SpringBoot_Project/uploads}")
    private String uploadDir;

    public StudentService(StudentRepository studentRepository, ModelMapper modelMapper) {
        this.studentRepository = studentRepository;
        this.modelMapper = modelMapper;
    }

    // Student record registration logic
    public StudentDTO createNewStudent(StudentDTO studentDTO, MultipartFile studentPhoto, MultipartFile additionalDocument) {
        if (studentRepository.existsByRollNumber(studentDTO.getRollNumber())) {
            throw new RuntimeException("Roll number already exists");
        }

        // Convert and validate student photo
        String studentPhotoBase64 = convertToBase64(studentPhoto);
        studentDTO.setStudentPhotoBase64(studentPhotoBase64);

        // Handle and validate additional document if provided
        if (additionalDocument != null && !additionalDocument.isEmpty()) {
            String fileExtension = getFileExtension(additionalDocument.getOriginalFilename());
            if (!isAcceptedFileType(fileExtension)) {
                throw new RuntimeException("File type not supported");
            }
            String additionalDocumentBase64 = convertToBase64(additionalDocument);
            studentDTO.setAdditionalDocumentBase64(additionalDocumentBase64);
        }

        StudentEntity studentEntity = modelMapper.map(studentDTO, StudentEntity.class);
        studentEntity = studentRepository.save(studentEntity);
        return modelMapper.map(studentEntity, StudentDTO.class);
    }

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    private boolean isAcceptedFileType(String fileExtension) {
        return fileExtension.equals("pdf") ||
                fileExtension.equals("doc") ||
                fileExtension.equals("docx") ||
                fileExtension.equals("xls") ||
                fileExtension.equals("xlsx") ||
                fileExtension.equals("jpg") ||
                fileExtension.equals("jpeg") ||
                fileExtension.equals("png") ||
                fileExtension.equals("gif") ||
                fileExtension.equals("txt");
    }

    private String convertToBase64(MultipartFile file) {
        try {
            byte[] fileBytes = file.getBytes();
            return Base64.getEncoder().encodeToString(fileBytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert file to Base64", e);
        }
    }

    // Searching individual student record by id
    public StudentDTO getStudentById(Long id) {
        StudentEntity studentEntity = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return modelMapper.map(studentEntity, StudentDTO.class);
    }

    // Fetching all student list on UI
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(student -> modelMapper.map(student, StudentDTO.class))
                .collect(Collectors.toList());
    }

    // Deleting individual student record
    public void deleteStudentByRollNumber(String rollNumber) {
        Optional<StudentEntity> studentEntity = studentRepository.findByRollNumber(rollNumber);
        if (studentEntity.isPresent()) {
            studentRepository.delete(studentEntity.get());
        } else {
            throw new RuntimeException("Student not found");
        }
    }

    // Individual student record update logic
    public StudentDTO updateStudentByRollNumber(String rollNumber, StudentDTO studentDTO) {
        Optional<StudentEntity> optionalStudent = studentRepository.findByRollNumber(rollNumber);

        if (optionalStudent.isPresent()) {
            StudentEntity studentEntity = optionalStudent.get();

            if (studentDTO.getStudentPhotoBase64() == null || studentDTO.getStudentPhotoBase64().isEmpty()) {
                studentDTO.setStudentPhotoBase64(studentEntity.getStudentPhotoBase64());
            } else {

                studentEntity.setStudentPhotoBase64(studentDTO.getStudentPhotoBase64());
            }

            modelMapper.map(studentDTO, studentEntity);

            studentRepository.save(studentEntity);

            return modelMapper.map(studentEntity, StudentDTO.class);
        } else {
            throw new RuntimeException("Student not found");
        }
    }
}
