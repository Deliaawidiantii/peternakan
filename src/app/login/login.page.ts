import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  showPassword = false;

  email: string = '';
  password: string = '';

  constructor() { }

  togglePassword(): void{
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void{
    console.log('Email:', this.email);
  }


}
