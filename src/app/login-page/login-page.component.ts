import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { API_BASEURL } from '../api';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  registerForm: FormGroup = new FormGroup({
    emailAddress: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    contact: new FormControl('')
  });
  loginForm: FormGroup = new FormGroup({
    emailAddress: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router, 
    private storageService: StorageService) { }
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      emailAddress: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contact: ['', Validators.required]
    })
    this.loginForm = this.formBuilder.group({
      emailAddress: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmitLogin() {
    const loginBody = this.loginForm.value;
    console.log('loginBody: ', JSON.stringify(loginBody));
    this.authService.userLogin(loginBody).subscribe((data) => {
      if (data['uuid']) {
        this.storageService.setItem('userId', data['uuid']);
        this.storageService.setItem('userEmail', loginBody['emailAddress']);
        this.router.navigate(['home']);
      } else {
        alert('Invalid username / password.');
      }
    });
  }

  registerUser() {
    const registerUserBody = this.registerForm.value;
    console.log('registerUserBody', registerUserBody);
    this.authService.registerUser(registerUserBody).subscribe((data) => {
      if(data.status.toString() == '200') {
        alert('Registration successful. Please login.')
        window.location.reload();
      } else {
        alert('Registration failed. Try again.');
      }

    });
  }
}

