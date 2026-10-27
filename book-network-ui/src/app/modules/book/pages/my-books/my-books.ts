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
  message = '';
  messageLevel: 'success' | 'error' = 'success';
  pendingBookId: number | null = null;
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
      },
      error: error => {
        this.showError(error, 'Your books could not be loaded. Please try again.');
      }
    })
  }

  goToFirstPage() {
    if (this.page === 0) return;
    this.page=0;
    this.findAllBooks();
  }

  goToPreviousPage() {
    if (this.page === 0) return;
    this.page--;
    this.findAllBooks();
  }

  goToNextPage() {
    if (this.isLastPage) return;
    this.page++;
    this.findAllBooks();
  }

  goToLastPage() {
    this.page = Math.max((this.bookResponse.totalPages ?? 1) - 1, 0);
    this.findAllBooks();
  }

  gotToPage(page:number) {
    if (page < 0 || page >= (this.bookResponse.totalPages ?? 0) || page === this.page) return;
    this.page=page;
    this.findAllBooks();
  }

  get  isLastPage():boolean{
    const totalPages = this.bookResponse.totalPages ?? 0;
    return totalPages === 0 || this.page >= totalPages - 1;
  }


  archiveBook(book: BookResponse) {
    if (book.id === undefined || this.pendingBookId !== null) return;
    this.pendingBookId = book.id;
    this.message = '';
    this.bookService.updateArchivedStatus({ 'book-id': book.id }).subscribe({
      next: () => {
        this.pendingBookId = null;
        this.messageLevel = 'success';
        this.message = book.archived ? 'Book restored to your active collection.' : 'Book archived.';
        this.findAllBooks();
      },
      error: error => {
        this.pendingBookId = null;
        this.showError(error, 'The book archive status could not be changed.');
      }
    });
  }

  shareBook(book: BookResponse) {
    if (book.id === undefined || this.pendingBookId !== null) return;
    this.pendingBookId = book.id;
    this.message = '';
    this.bookService.updateSharableStatus({ 'book-id': book.id }).subscribe({
      next: () => {
        this.pendingBookId = null;
        this.messageLevel = 'success';
        this.message = book.shareable
          ? 'Book is no longer available to borrow.'
          : 'Book is now available to borrow.';
        this.findAllBooks();
      },
      error: error => {
        this.pendingBookId = null;
        this.showError(error, 'The book sharing status could not be changed.');
      }
    });
  }

  editBook(book: BookResponse) {
    if (book.id === undefined) return;
    this.router.navigate(['/books/manage', book.id]);
  }

  private showError(error: unknown, fallback: string): void {
    const response = error as { error?: { error?: string } };
    this.messageLevel = 'error';
    this.message = response.error?.error || fallback;
  }
}
