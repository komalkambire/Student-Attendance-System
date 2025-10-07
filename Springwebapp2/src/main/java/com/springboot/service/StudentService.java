package com.springboot.service;

import com.springboot.entity.Student;

public interface StudentService {

	public boolean registerStudent(Student student);
	public Student loginStudent(String email,String password);
	
}
