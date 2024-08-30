import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Student {
id: number;
name: string;
age: number;
gender: string;
course: string;
stream: string;
semester: string;
rollNumber: string;
studentPhotoBase64: string;
studentPhotoUrl?: string;
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
errorMessage: string = '';
selectedStudent: Student = {
id: 0,
name: '',
age: 0,
gender: '',
course: '',
stream: '',
semester: '',
rollNumber: '',
studentPhotoBase64: ''
};
isEditing: boolean = false;
streams: string[] = [];
errorMessageName: string = '';
private apiUrl = 'http://localhost:8080/api/students';

constructor(private http: HttpClient) {}

  ngOnInit() {}

  // Load all students when Student List button is clicked
  loadAllStudents() {
    this.errorMessage = '';
    this.searchQuery = '';
    this.loadStudents();
  }

  loadStudents() {
    this.http.get<Student[]>(this.apiUrl).subscribe(
      (response: Student[]) => {
        this.students = response.map(student => {
          student.studentPhotoUrl = this.getImageUrl(student.studentPhotoBase64);
          return student;
        });
        this.filteredStudents = this.students;
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }

  // Filter student records based on Registration ID
  filterStudents() {
    this.validateInput();

    if (this.errorMessage) {
      this.filteredStudents = [];
      return;
    }

    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.filteredStudents = [];
      this.errorMessage = '';
    } else {
      this.http.get<Student>(`${this.apiUrl}/${query}`).subscribe(
        (student: Student) => {
          if (student) {
            student.studentPhotoUrl = this.getImageUrl(student.studentPhotoBase64);
            this.filteredStudents = [student];
            this.errorMessage = '';
          } else {
            this.filteredStudents = [];
            this.errorMessage = 'Student record not found';
          }
        },
        (error) => {
          console.error('Error fetching student:', error);
          this.errorMessage = 'Student record not found';
          this.filteredStudents = [];
        }
      );
    }
  }

  // Fetch Base64 image URL
  getImageUrl(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }

  // Edit student record
  editStudent(student: Student) {
    this.selectedStudent = {
      ...student,
      studentPhotoBase64: student.studentPhotoBase64 || this.selectedStudent.studentPhotoBase64,
    };
    this.isEditing = true;
    this.populateStreams();
  }

  // Save updated student record
  saveStudent() {
    if (this.validateForm()) {
      if (this.selectedStudent) {
        const updatedStudent = { ...this.selectedStudent };
        updatedStudent.studentPhotoBase64 = this.selectedStudent.studentPhotoBase64;

        this.http.put<Student>(`${this.apiUrl}/${updatedStudent.rollNumber}`, updatedStudent).subscribe(
          () => {
            this.isEditing = false;
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
  }

  // Delete student record from database
  deleteStudent(rollNumber: string) {
    const confirmed = window.confirm('Are you sure you want to delete this student record?');
    if (confirmed) {
      this.http.delete(`${this.apiUrl}/${rollNumber}`).subscribe(
        response => {
          window.alert('Student record deleted successfully!!');
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
      studentPhotoBase64: ''
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

  // Search bar validation code
  validateInput() {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>\"/';-_+=]/g;
    if (!this.searchQuery.trim()) {
      this.errorMessage = 'Please enter a valid registration ID.';
    } else if (specialCharPattern.test(this.searchQuery)) {
      this.errorMessage = 'No special characters allowed in the search.';
    } else {
      this.errorMessage = '';
    }
  }

  // Validation logic for name
  validateName() {
    const name = this.selectedStudent.name?.trim();
    const namePattern = /^[a-zA-Z\s]*$/;

    if (!name) {
      this.errorMessageName = 'Name is required.';
    } else if (!namePattern.test(name)) {
      if (/\d/.test(name)) {
        this.errorMessageName = 'Numbers are not allowed.';
      } else {
        this.errorMessageName = 'Special characters are not allowed.';
      }
    } else if (name.length < 2) {
      this.errorMessageName = 'Name must be at least 2 characters long.';
    } else if (name.length > 100) {
      this.errorMessageName = 'Name can be a maximum of 100 characters long.';
    } else {
      this.errorMessageName = '';
    }
  }

  // Validation logic for age
  validateAge() {
    const age = this.selectedStudent.age;
    if (!age) {
      this.errorMessage = 'Age is required';
    } else if (age < 16) {
      this.errorMessage = 'Minimum Age for Registration is 16';
    } else if (age > 24) {
      this.errorMessage = 'Maximum Age for Registration is 24';
    } else {
      this.errorMessage = '';
    }
  }

  // Validate form for alert message
  validateForm(): boolean {
    this.validateAge();
    this.validateName();

    if (this.errorMessage || this.errorMessageName) {
      return false;
    }

    // Check if required fields are filled out or not if not throw an error message
    if (!this.selectedStudent.name || !this.selectedStudent.age || !this.selectedStudent.gender ||
        !this.selectedStudent.rollNumber || !this.selectedStudent.course ||
        !this.selectedStudent.semester || !this.selectedStudent.stream) {
      window.alert('Please fill out all required fields.');
      return false;
    }
    return true;
  }
  // Download student data as an image
  downloadStudentImage(student: Student) {
    const studentCard = document.createElement('div');
    studentCard.style.width = '400px';
    studentCard.style.textAlign = 'center';
    studentCard.innerHTML = `
      <div style="padding: 20px;">
        <img src="${student.studentPhotoUrl}" alt="Student Photo" style="width: 150px; height: 150px; border-radius: 10px; border: 2px solid #009988;">
        <p style="font-size: 15px; margin: 10px 0;"><strong>Name:</strong> ${student.name}</p>
        <p style="font-size: 15px; margin: 10px 0;"><strong>Age:</strong> ${student.age}</p>
        <p style="font-size: 15px; margin: 10px 0;"><strong>Gender:</strong> ${student.gender}</p>
        <p style="font-size: 15px; margin: 10px 0;"><strong>Roll Number:</strong> ${student.rollNumber}</p>
        <p style="font-size: 15px; margin: 10px 0;"><strong>Course:</strong> ${student.course}</p>
        <p style="font-size: 15px; margin: 10px 0;"><strong>Stream:</strong> ${student.stream}</p>
        <p style="font-size: 15px; margin: 10px 0;"><strong>Semester:</strong> ${student.semester}</p>
        <p style="font-size: 15px; margin: 10px 0;"><strong>Registration ID:</strong> ${student.id}</p>
      </div>
    `;

    document.body.appendChild(studentCard);
    html2canvas(studentCard).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const xPos = (pdfWidth - imgWidth) / 2;
      const yPos = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
      pdf.save(`${student.name}_Data.pdf`);

      document.body.removeChild(studentCard);
    });
  }
}

