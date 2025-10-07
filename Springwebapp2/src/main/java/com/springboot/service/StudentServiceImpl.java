package com.springboot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.entity.Student;
import com.springboot.repo.StudentRepository;

@Service
public  class StudentServiceImpl implements StudentService {

	@Autowired
	private StudentRepository studentRepository;
	
	@Override
	public boolean registerStudent(Student student) {
		
		try {
			
		studentRepository.save(student);
		return true;
		
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return false;
		}
	}
	@Override
	public Student loginStudent(String email, String password) {
		Student validStudent = studentRepository.findByEmail(email);
		
		if(validStudent != null  && validStudent.getPassword().equals(password)) 
		{
			return validStudent;
		}
		return null;
	}
	

}
