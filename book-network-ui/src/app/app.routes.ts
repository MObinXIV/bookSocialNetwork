import { Routes } from '@angular/router';
import {Login} from './pages/login/login';
import {Register} from './pages/register/register';
import {ActivateAccount} from './pages/activate-account/activate-account';
import { authGuard } from './services/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'books'
  },
  {
    path:'login',
    component:Login
  },
  {
    path:'register',
    component:Register
  },
  {
    path:'activate-account',
    component:ActivateAccount
  },
  {
    path:'books',
    canActivate: [authGuard],
    loadChildren: ()=> import('./modules/book/book-module').then(m => m.BookModule)
  },
  {
    path: '**',
    redirectTo: 'books'
  }
];
