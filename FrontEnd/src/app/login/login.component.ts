import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Student {
  name: string;
  age: number;
  gender: string;
  course: string;
  stream: string;
  semester: string;
  rollNumber: string;
  studentPhotoUrl: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchRollNumber: string = '';
  selectedStudent: Student = {
    name: '',
    age: 0,
    gender: '',
    course: '',
    stream: '',
    semester: '',
    rollNumber: '',
    studentPhotoUrl: ''
  };
  isEditing: boolean = false;
  streams: string[] = [];

  private apiUrl = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStudents();
  }
// Student data loading logic
  loadStudents() {
    this.http.get<Student[]>(this.apiUrl).subscribe(
      (response: Student[]) => {
        this.students = response;
        this.filteredStudents = response;
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }
// Filter student record on the basis of rollNumber
  filterStudents() {
    if (this.searchRollNumber) {
      this.filteredStudents = this.students.filter(student =>
        student.rollNumber.includes(this.searchRollNumber)
      );
    } else {
      this.filteredStudents = this.students;
    }
  }
// Edit student record
  editStudent(student: Student) {
    this.selectedStudent = { ...student };
    this.isEditing = true;
    this.populateStreams();
  }
// Student updated record saving logic
  saveStudent() {
    const updatedStudent = { ...this.selectedStudent };
    this.http.put(`${this.apiUrl}/${updatedStudent.rollNumber}`, updatedStudent).subscribe(
      () => {
        this.isEditing = false;
        this.loadStudents();
        alert('Student updated successfully');
      },
      (error) => {
        console.error('Error updating student:', error);
      }
    );
  }
// Student record deletion logic
  deleteStudent(rollNumber: string) {
    const confirmed = window.confirm('Are you sure you want to delete this student record?');
    if (confirmed) {
      this.http.delete(`${this.apiUrl}/${rollNumber}`).subscribe(
        response => {
          window.alert('Student record deleted successfully!!');
          this.loadStudents();
        },
        error => {
          console.error('Error deleting student:', error);
          window.alert('Failed to delete student record');
        }
      );
    }
  }
// Updating student record when discarded
  discardChanges() {
    this.isEditing = false;
    this.selectedStudent = {
      name: '',
      age: 0,
      gender: '',
      course: '',
      stream: '',
      semester: '',
      rollNumber: '',
      studentPhotoUrl: ''
    };
  }
// Stream list on update button click
  populateStreams() {
    const course = this.selectedStudent.course;
    if (course === 'BA') {
      this.streams = ['History', 'Political Science', 'Psychology'];
    } else if (course === 'BSc') {
      this.streams = ['Physics', 'Chemistry', 'Biology'];
    } else if (course === 'BCom') {
      this.streams = ['Accounting', 'Finance', 'Marketing'];
    } else if (course === 'BBA') {
      this.streams = ['Human Resources', 'International Business', 'Marketing'];
    } else if (course === 'BCA') {
      this.streams = ['Software Development', 'Network Security', 'Data Science'];
    } else if (course === 'BTech') {
      this.streams = ['Computer Science', 'Mechanical', 'Civil', 'Electrical'];
    } else {
      this.streams = [];
    }
    this.selectedStudent.stream = '';
  }
}

