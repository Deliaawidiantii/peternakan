import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  Username : string = '';
  Password : string = '';

  constructor(
    private router : Router
  ) {
   
  }
  doLogin() {
    console.log(this.Username, this.Password);
    localStorage.setItem('Username', this.Username)
    localStorage.setItem('Password', this.Password)
    this.router.navigateByUrl('/account')

    }
  

}
