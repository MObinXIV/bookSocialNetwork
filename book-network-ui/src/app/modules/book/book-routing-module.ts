import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Main} from './pages/main/main';
import {BookList} from './pages/book-list/book-list';

const routes: Routes = [
  {
    path:'',
    component: Main,
    children:[
      {
        path: '',
        component: BookList
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
