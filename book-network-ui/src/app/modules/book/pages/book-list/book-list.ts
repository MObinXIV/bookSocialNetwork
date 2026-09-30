import {Component, OnInit} from '@angular/core';
import {BookService} from '../../../../services/services/book.service';
import {Router} from '@angular/router';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookCard} from '../../components/book-card/book-card';
import {BookResponse} from '../../../../services/models/book-response';

@Component({
  selector: 'app-book-list',
  imports: [
    BookCard
  ],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
  standalone: true
})
export class BookList implements OnInit {
  bookResponse: PageResponseBookResponse={};
   page =0;
   size =5;
   message='';
  level = 'success';
  constructor(
    private bookService: BookService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks() {
    this.bookService.findAllBooks({
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

  borrowBook(book: BookResponse) {
    this.message='';
    this.bookService.borrowBook({
      'book-id':book.id as number
    }).subscribe({
      next : ()=>{
        this.level = 'success';
       this.message = 'Book Successfully added to your list';
      },
      error: (err)=>{
        console.log(err);
        this.level = 'error';
        this.message = err.error.error;
      }
    });
  }
}
