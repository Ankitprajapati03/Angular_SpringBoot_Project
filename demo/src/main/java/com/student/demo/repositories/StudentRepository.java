package com.student.demo.repositories;

import com.student.demo.entities.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
    Optional<StudentEntity> findByRollNumber(String rollNumber);
    boolean existsByRollNumber(String rollNumber);
}
