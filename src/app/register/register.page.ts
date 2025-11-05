import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage{

  form = {
    nama: '',
    nik: '',
    email: '',
    desa_binaan: '',
    no_telp: '',
    password: '',
    password_confirmation: ''
  }; 

  errors: string[] = []; //pesan error 

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor() { }

  togglePassword(){
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(){
    this.showConfirmPassword = !this.showConfirmPassword; 
  }

  onRegister(){
    console.log('form dikirm:', this.form);

    this.errors=[]; //reset pesan error
    if(!this.form.nama){
      this.errors.push('Nama harus diisi');
    }

    if(this.form.password !== this.form.password_confirmation){ 
      this.errors.push('Password dan konfirmasi password harus sama');
    }

    if(this.errors.length === 0){
      // TODO: kirim data ke server
  }

  }
}
