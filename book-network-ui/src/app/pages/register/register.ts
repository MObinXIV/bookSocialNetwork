import { Component } from '@angular/core';
import {RegistrationRequest} from '../../services/models/registration-request';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  errorMsg: string[] = [];
  isSubmitting = false;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {
  }
  register(): void {
    if (this.isSubmitting) return;
    this.errorMsg = [];
    this.isSubmitting = true;
    this.authService.register({
      body: this.registerRequest,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/activate-account']);
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
        if (!this.errorMsg.length) this.errorMsg = ['Your account could not be created. Please try again.'];
      }
    })
  }

  login() {
    this.router.navigate(['login']);
  }
}
