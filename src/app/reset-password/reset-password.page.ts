import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage {

  form = {
    email: '',
    password: '',
    password_confirmation: ''
  };

  errors: string[] = []; //pesan error



  constructor() { }

  onSubmit(){
    this.errors=[]; //reset pesan error

    if(!this.form.email || !this.form.password || !this.form.password_confirmation){
      this.errors.push('Semua field harus diisi');
      return
    }

    if(this.form.password !== this.form.password_confirmation){ 
      this.errors.push('Password dan konfirmasi password harus sama');
      return
    }

    //TOO: kirim data ke server
    console.log('form dikirim:', this.form);
  }

 

}
