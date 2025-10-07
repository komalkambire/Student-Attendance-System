package com.springboot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class Student {

@Id
@GeneratedValue(strategy= GenerationType.IDENTITY)
private int id;

@Column
private String profilePic;
@Column
private String role;
@Column
private String fullname;
@Column
private String email;
@Column
private String password;
@Column
private String contact;


public int getId() {
	return id;
}
public void setId(int id) {
	this.id = id;
}
public String getProfilePic() {
	return profilePic;
}
public void setProfilePic(String profilePic) {
	this.profilePic = profilePic;
}
public String getRole() {
	return role;
}
public void setRole(String role) {
	this.role = role;
}
public String getFullname() {
	return fullname;
}
public void setFullname(String fullname) {
	this.fullname = fullname;
}
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}
public String getPassword() {
	return password;
}
public void setPassword(String password) {
	this.password = password;
}
public String getContact() {
	return contact;
}
public void setContact(String contact) {
	this.contact = contact;
}

@Override
public String toString() {
	return "Student [id=" + id + ", profilePic=" + profilePic + ", role=" + role + ", fullname=" + fullname + ", email="
			+ email + ", password=" + password + ", contact=" + contact + "]";
}
}
