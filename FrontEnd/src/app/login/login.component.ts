import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Student {
  id: number;
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
  searchQuery: string = '';
  selectedStudent: Student = {
    id: 0,
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

  ngOnInit() {}

  // Load all students when Student List button is clicked
  loadAllStudents() {
    this.loadStudents();
  }

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

  // Filter student records based on Registration ID
  filterStudents() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.http.get<Student>(`${this.apiUrl}/${query}`).subscribe(
        (student: Student) => {
          this.filteredStudents = student ? [student] : [];
        },
        (error) => {
          console.error('Error fetching student:', error);
          this.filteredStudents = [];
        }
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

  // Save updated student record
  saveStudent() {
    if (this.selectedStudent) {
      const updatedStudent = { ...this.selectedStudent };

      this.http.put<Student>(`${this.apiUrl}/${updatedStudent.rollNumber}`, updatedStudent).subscribe(
        () => {
          this.isEditing = false;
          //this.loadStudents();
          alert('Student record updated successfully');
          window.location.reload();
        },
        (error) => {
          console.error('Error updating student:', error);
          alert('Failed to update student. Please check the input and try again.');
        }
      );
    }
  }

  // Delete student record from database
  deleteStudent(rollNumber: string) {
    const confirmed = window.confirm('Are you sure you want to delete this student record?');
    if (confirmed) {
      this.http.delete(`${this.apiUrl}/${rollNumber}`).subscribe(
        response => {
          window.alert('Student record deleted successfully!!');
          //this.loadStudents();
          window.location.reload();

        },
        error => {
          console.error('Error deleting student:', error);
          window.alert('Failed to delete student record');
        }
      );
    }
  }

  // Discard the update student form opened
  discardChanges() {
    this.isEditing = false;
    this.selectedStudent = {
      id: 0,
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

  // Populate streams based on the selected course
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
