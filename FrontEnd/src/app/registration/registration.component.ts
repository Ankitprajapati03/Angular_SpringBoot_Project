import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
selector: 'app-registration',
templateUrl: './registration.component.html',
styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
registrationObj: any = {
registrationId: 0,
rollNumber: '',
name: '',
age: null,
gender: '',
course: '',
semester: '',
stream: '',
studentPhoto: null as File | null,
additionalDocument: null as File | null
};

streams: string[] = [];
studentPhoto: File | null = null;
additionalDocument: File | null = null;
errorMessage: string = '';
errorMessageName: string = '';
errorMessageRollNumber: string = '';

constructor(private http: HttpClient) {}
//Form register function
  onRegister() {
    if (this.validateForm()) {
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
          window.location.href = "/homepage";
        },
        (error) => {
              if (error.status === 400 || error.error?.message === 'Roll number already exists') {
                      alert("Roll number already exist. Please choose new.");
              } else {
                alert("An error occurred while registering.");
                console.error("API call error:", error);
              }
            }
      );
    }
  }
//File upload function
  onFileSelect(event: any, fileType: string) {
    const file = event.target.files[0];
    if (fileType === 'studentPhoto') {
      this.studentPhoto = file;
    } else if (fileType === 'additionalDocument') {
      this.additionalDocument = file;
    }
  }
//Stream dropdown values
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
//Validation logic for age
  validateAge() {
    const age = this.registrationObj.age;
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
//Validation logic for name
  validateName() {
    const name = this.registrationObj.name.trim();
    const namePattern = /^[a-zA-Z\s]*$/;

 if (!name) {
      this.errorMessageName = 'Name is required'; //
    }
  else if (!namePattern.test(name)) {
        if (/\d/.test(name)) {
          this.errorMessageName = 'Numbers are not allowed.';
        } else {
          this.errorMessageName = 'Special characters are not allowed.';
        }
      }
  else if (name.length < 2) {
      this.errorMessageName = 'Name must be at least 2 characters long.';
    }
  else if (name.length > 100) {
        this.errorMessageName = 'Name can be maximum 100 characters long.';
      }
  else {
      this.errorMessageName = '';
    }
  }
//Validation logic for roll number
 validateRollNumber() {
  const rollNumber = this.registrationObj.rollNumber.trim();
  const rollNumberPattern = /^[a-zA-Z0-9]+$/;

   if (!rollNumber) {
      this.errorMessageRollNumber = 'Roll Number is required';
    }
  else if (!rollNumberPattern.test(rollNumber)) {
      this.errorMessageRollNumber = 'Special Character are not allowed.';
    }
  else if (rollNumber.length > 20) {
      this.errorMessageRollNumber = 'Roll Number can be maximum 20 characters long.';
    }
   else {
    this.errorMessageRollNumber = '';
  }
}
//Validate form function
 validateForm(): boolean {
  this.validateAge();
  this.validateName();
  this.validateRollNumber();

  if (this.errorMessage || this.errorMessageName || this.errorMessageRollNumber) {
    return false;
  }

  // Check if required fields are filled out or not if not throw an error message
  if (!this.registrationObj.name || !this.registrationObj.age || !this.registrationObj.gender ||
      !this.registrationObj.rollNumber || !this.registrationObj.course ||
      !this.registrationObj.semester || !this.registrationObj.stream ||
      !this.studentPhoto) {
    window.alert('Please fill out all required fields.');
    return false;
  }
  return true;
}
}

