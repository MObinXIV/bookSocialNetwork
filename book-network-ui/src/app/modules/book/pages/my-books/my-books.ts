import {Component, OnInit} from '@angular/core';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookService} from '../../../../services/services/book.service';
import {Router, RouterLink} from '@angular/router';
import {BookResponse} from '../../../../services/models/book-response';
import {BookCard} from '../../components/book-card/book-card';

@Component({
  selector: 'app-my-books',
  imports: [
    BookCard,
    RouterLink
  ],
  templateUrl: './my-books.html',
  styleUrl: './my-books.scss',
  standalone: true
})
export class MyBooks implements OnInit{
  bookResponse: PageResponseBookResponse={};
  page =0;
  size =5;
  constructor(
    private bookService: BookService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks() {
    this.bookService.findBooksByOwner({
      page: this.page,
      size: this.size
    }).subscribe({
      next: books => {
        this.bookResponse = books;
      }
    })
  }

  goToFirstPage() {
    this.page=0;
    this.findAllBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBooks();
  }

  goToLastPage() {
    this.page = (this.bookResponse.totalPages ?? 0) - 1;
    this.findAllBooks();
  }

  gotToPage(page:number) {
    this.page=page;
    this.findAllBooks();
  }

  get  isLastPage():boolean{
    return this.page === (this.bookResponse.totalPages ?? 0) - 1;
  }


  archiveBook(book: BookResponse) {

  }

  shareBook(book: BookResponse) {

  }

  editBook(book: BookResponse) {

  }
}
