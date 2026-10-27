import { Component } from '@angular/core';
import {AuthenticationRequest} from '../../services/models/authentication-request';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/services/authentication.service';
import {TokenService} from '../../services/token/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login {
  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: string[] = [];
  isSubmitting = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private tokenService: TokenService,
  ) {
  }
  login(): void {
    if (this.isSubmitting) return;
    this.errorMsg = [];
    this.isSubmitting = true;
    this.authService.login(
      {
      body: this.authRequest
      }
    ).subscribe({
      next: res => {
      if (!res.token) {
        this.isSubmitting = false;
        this.errorMsg = ['The server did not return a sign-in token. Please try again.'];
        return;
      }
      this.tokenService.token = res.token;
      this.isSubmitting = false;
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      if (returnUrl?.startsWith('/') && !returnUrl.startsWith('//')) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/books']);
      }
      },
      error: (error: unknown) => {
      this.isSubmitting = false;
      if (error instanceof HttpErrorResponse && typeof error.error === 'object' && error.error !== null) {
        const validationErrors = error.error.validationErrors;
        if (Array.isArray(validationErrors)) {
          this.errorMsg = validationErrors.filter((message: unknown): message is string => typeof message === 'string');
        }
        if (!this.errorMsg.length && typeof error.error.error === 'string') {
          this.errorMsg = [error.error.error];
        }
      }
      if (!this.errorMsg.length) this.errorMsg = ['Sign in failed. Check your email and password, then try again.'];
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}
