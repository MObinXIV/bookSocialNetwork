import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../token/token.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const tokenService = inject(TokenService);
  if (tokenService.token) {
    return true;
  }

  return inject(Router).createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
