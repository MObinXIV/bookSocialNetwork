import { Component } from '@angular/core';
import {RegistrationRequest} from '../../services/models/registration-request';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/services/authentication.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true
})
export class Register {
  registerRequest: RegistrationRequest = {email: '',firstName: '',lastName: '', password: ''};
  errorMsg: Array<String>=[];
  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {
  }
  register() {
    this.errorMsg = [];
    this.authService.register({
      body: this.registerRequest,
    }).subscribe({
      next: ()=>{this.router.navigate(['activate-account']);},
      error : (err)=>{this.errorMsg= err.error.validationErrors;}
    })
  }

  login() {
    this.router.navigate(['login']);
  }
}
