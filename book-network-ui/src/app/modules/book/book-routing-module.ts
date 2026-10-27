import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Main} from './pages/main/main';
import {BookList} from './pages/book-list/book-list';
import {MyBooks} from './pages/my-books/my-books';
import {ManageBook} from './pages/manage-book/manage-book';
import {BorrowedBookList} from './pages/borrowed-book-list/borrowed-book-list';
import { ReturnBooks } from './pages/return-books/return-books';
import { BookDetails } from './pages/book-details/book-details';

const routes: Routes = [
  {
    path: '',
    component: Main,
    children: [
      { path: '', component: BookList },
      { path: 'my-books', component: MyBooks },
      { path: 'my-borrowed-books', component: BorrowedBookList },
      { path: 'my-returned-books', component: ReturnBooks },
      { path: 'manage', component: ManageBook },
      { path: 'manage/:bookId', component: ManageBook },
      { path: ':bookId', component: BookDetails }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
