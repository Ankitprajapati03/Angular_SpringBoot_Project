import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationObj: any = {
    "registrationId": 0,
    "rollNumber": "",
    "name": "",
    "age": null,
    "gender": "",
    "course": "",
    "semester": "",
    "stream": "",
    "studentPhoto": null as File | null,
    "additionalDocument": null as File | null
  };

  streams: string[] = [];
  studentPhoto: File | null = null;
  additionalDocument: File | null = null;

  constructor(private http: HttpClient) { }

  onRegister() {
    const formData: FormData = new FormData();
    formData.append('name', this.registrationObj.name);
    formData.append('age', this.registrationObj.age?.toString() || '');
    formData.append('gender', this.registrationObj.gender);
    formData.append('rollNumber', this.registrationObj.rollNumber);
    formData.append('course', this.registrationObj.course);
    formData.append('semester', this.registrationObj.semester.toString());
    formData.append('stream', this.registrationObj.stream);
    if (this.studentPhoto) {
      formData.append('studentPhoto', this.studentPhoto, this.studentPhoto.name);
    }
    if (this.additionalDocument) {
      formData.append('additionalDocument', this.additionalDocument, this.additionalDocument.name);
    }
    this.http.post("http://localhost:8080/api/students", formData).subscribe(
      (res: any) => {
        alert("Registration Successful");
      },
      (error) => {
        alert("An error occurred while registering.");
        console.error("API call error:", error);
      }
    );
  }

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
      this.streams = [];
    }
    this.registrationObj.stream = '';
  }

  onFileSelect(event: any, fileType: string) {
    const file = event.target.files[0];
    if (fileType === 'studentPhoto') {
      this.studentPhoto = file;
    } else if (fileType === 'additionalDocument') {
      this.additionalDocument = file;
    }
  }
}
