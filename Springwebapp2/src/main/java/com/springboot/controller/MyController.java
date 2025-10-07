package com.springboot.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.springboot.entity.Student;
import com.springboot.service.StudentService;

@Controller
public class MyController {
	
	@Autowired
	private StudentService studentService;
	
	@GetMapping("/regPage")
	public String OpenRegPage(Model model)
	{
		model.addAttribute("student",new Student());
		return"register";
	}
	
	@PostMapping("/regForm")
		public String submitRegFrom(@ModelAttribute("student")Student student,Model model)
		{
		boolean status = studentService.registerStudent(student);
		if(status) {
			model.addAttribute("successMsg"," registered successfully");
			
		}
		else {
			model.addAttribute("errorMsg"," not registered");
		}
		return"register";
		}
	

@GetMapping("/loginPage")
public String openLoginPage(Model model)
{
	model.addAttribute("student",new Student());
	return "login";
}

@PostMapping("/loginForm")
public String submitLoginForm(@ModelAttribute("student")Student student,Model model)
{
	Student validStudent = studentService.loginStudent(student.getEmail(), student.getPassword());
	if(validStudent != null)
	{
		return "studentprofile";
	}
	else {
		model.addAttribute("errorMsg","Email and password  not match");
		return"login";
	}	
}


@GetMapping("/tloginPage")
public String topenLoginPage(Model model)
{
	model.addAttribute("student",new Student());
	return "tlogin";
}

@PostMapping("/tloginForm")
public String tsubmitLoginForm(@ModelAttribute("student")Student student,Model model)
{
	Student validStudent = studentService.loginStudent(student.getEmail(), student.getPassword());
	if(validStudent != null)
	{
		return "teacherdash";
	}
	else {
		model.addAttribute("errorMsg","Email and password  not match");
		return"tlogin";
	}	
}


@GetMapping("/aloginPage")
public String aopenLoginPage(Model model)
{
	model.addAttribute("student",new Student());
	return "alogin";
}

@PostMapping("/aloginForm")
public String asubmitLoginForm(@ModelAttribute("student")Student student,Model model)
{
	Student validStudent = studentService.loginStudent(student.getEmail(), student.getPassword());
	if(validStudent != null)
	{
		return "admindash";
	}
	else {
		model.addAttribute("errorMsg","Email and password  not match");
		return"alogin";
	}	
}



}