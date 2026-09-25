import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/services/authentication.service';
import {CodeInputModule} from 'angular-code-input';

@Component({
  selector: 'app-activate-account',
  imports: [
    CodeInputModule
  ],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.scss',
  standalone: true
})
export class ActivateAccount {
  message:string='';
  isOkay: boolean = true;
  submitted: boolean = false;
  constructor(private router: Router,
              private authService: AuthenticationService
              ){

  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  private confirmAccount(token: string) {
    this.authService.confirm({
      token
    }).subscribe({
      next : ()=>{
        this.message ='Your account has been successfully activated.\nNow you can proceed to login';
        this.submitted=true;
      },
      error: () => {
        this.message = 'Token has been expired or invalid';
        this.submitted=true;
        this.isOkay=false;
      }
    });
  }
}
