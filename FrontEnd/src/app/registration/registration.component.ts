import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  // Initializing the registration object
  registrationObj: any = {
    "registrationId": 0,
    "rollNumber": "",
    "name": "",
    "age": null,
    "gender": "",
    "course": "",
    "semester": "",
    "stream": "",
    "studentPhoto": null,
    "additionalDocument": null
  };

  // Array to store streams based on selected course
  streams: string[] = [];

  // Injecting HttpClient service
  constructor(private http: HttpClient) { }

  onRegister() {
    this.http.post("http://localhost:8080/POST/api/students", this.registrationObj).subscribe(
      (res: any) => {
        if (res.result) {
          alert("Registration Successful");
        } else {
          alert(res.message);
        }
      },
      (error) => {
        alert("An error occurred while registering. Please try again.");
        console.error("API call error:", error);
      }
    );
  }

  // Function to populate streams based on selected course
  populateStreams() {
    const course = this.registrationObj.course;

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
      this.streams = []; // Clear streams if no course selected
    }

    // Reset stream selection if course changes
    this.registrationObj.stream = '';
  }

  // Function to handle file selection
  onFileSelect(event: any, fileType: string) {
    const file = event.target.files[0];
    if (fileType === 'studentPhoto') {
      this.registrationObj.studentPhoto = file;
    } else if (fileType === 'additionalDocument') {
      this.registrationObj.additionalDocument = file;
    }
  }
}
