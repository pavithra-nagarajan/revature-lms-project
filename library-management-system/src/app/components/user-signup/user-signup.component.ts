import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {
  signupForm?: FormGroup;
  errorMessage?: String

  user?: User;
  mailUser?: User
  mobileUser?: User
  constructor(public activatedRoute: ActivatedRoute, public userService: UserService, public formBuilder: FormBuilder,
    public router: Router) { }

  ngOnInit(): void {
    this.user = new User();

    this.signupForm = this.formBuilder.group({
      userId: [-1,],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      userRole: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.minLength(18)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(10)]],
      mailId: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]]
    },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),

      })
  }

  mailCheck() {
    this.userService.getUserByMailId(this.signupForm.get('mailId').value).subscribe(data => {
      this.mailUser = data
      if (this.mailUser == null) {
        this.mobileCheck()

      }
      else {
        this.errorMessage = "*** MailId already exists!"
      }
    })
  }

  mobileCheck() {
    this.userService.getUserByMobileNumber(this.signupForm.get('mobileNumber').value).subscribe(data => {
      this.mobileUser = data
      if (this.mobileUser == null) {
        this.errorMessage = ""
        this.userSignUp()

      }
      else {
        this.errorMessage = "*** Mobile Number already exists!"
      }
    })
  }

  userSignUp() {

    this.userService.addUser(this.signupForm?.value)
      .subscribe(
        response => {

          this.user = response
          console.log(this.user)

        }, error => {

          this.successNotification()
          this.router.navigate(['**'])
        })

  }

  return() {
    this.router.navigate(['**'])
  }
  successNotification() {
    Swal.fire('Success', 'User Account created Successfully!', 'success')
  }

}


function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

