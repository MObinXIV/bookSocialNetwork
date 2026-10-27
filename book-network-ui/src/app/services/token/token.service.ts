import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  set token(token: string) {
    localStorage.setItem('token', token);
  }
  get token(): string | null {
    return localStorage.getItem('token');
  }

  clear(): void {
    localStorage.removeItem('token');
  }
}
