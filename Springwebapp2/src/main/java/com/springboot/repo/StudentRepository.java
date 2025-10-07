package com.springboot.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.entity.Student;

public interface StudentRepository extends JpaRepository<Student,Integer> {
	Student findByEmail(String email);
}
