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
  bookResponse: PageResponseBookResponse = { content: [] };
  page = 0;
  size = 5;
  message = '';
  level: 'success' | 'error' = 'success';
  isLoading = true;
  loadError = '';
  pendingBookId: number | null = null;
  private borrowedBookIds = new Set<number>();
  constructor(
    private bookService: BookService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }

  findAllBooks(): void {
    this.isLoading = true;
    this.loadError = '';
    this.bookService.findAllBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: books => {
        this.bookResponse = books;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.loadError = this.getErrorMessage(error, 'Books could not be loaded. Please try again.');
      }
    });
  }

  goToFirstPage(): void {
    if (this.page === 0 || this.isLoading) return;
    this.page=0;
    this.findAllBooks();
  }

  goToPreviousPage(): void {
    if (this.page === 0 || this.isLoading) return;
    this.page--;
    this.findAllBooks();
  }

  goToNextPage(): void {
    if (this.isLastPage || this.isLoading) return;
    this.page++;
    this.findAllBooks();
  }

  goToLastPage(): void {
    if (this.isLastPage || this.isLoading) return;
    this.page = Math.max((this.bookResponse.totalPages ?? 1) - 1, 0);
    this.findAllBooks();
  }

  gotToPage(page: number): void {
    if (page < 0 || page >= (this.bookResponse.totalPages ?? 0) || page === this.page || this.isLoading) return;
    this.page=page;
    this.findAllBooks();
  }

  get isLastPage(): boolean {
    const totalPages = this.bookResponse.totalPages ?? 0;
    return totalPages === 0 || this.page >= totalPages - 1;
  }

  borrowBook(book: BookResponse): void {
    const bookId = book.id;
    if (bookId === undefined || this.pendingBookId !== null || this.borrowedBookIds.has(bookId)) return;
    this.message = '';
    this.pendingBookId = bookId;
    this.bookService.borrowBook({
      'book-id': bookId
    }).subscribe({
      next: () => {
        this.pendingBookId = null;
        this.borrowedBookIds.add(bookId);
        this.level = 'success';
        this.message = `“${book.title || 'Book'}” was added to your borrowed books.`;
      },
      error: error => {
        this.pendingBookId = null;
        this.level = 'error';
        this.message = this.getErrorMessage(error, 'This book could not be borrowed. Please try again.');
      }
    });
  }

  showBookDetails(book: BookResponse): void {
    if (book.id !== undefined) this.router.navigate(['/books', book.id]);
  }

  isBookBorrowed(book: BookResponse): boolean {
    return book.id !== undefined && this.borrowedBookIds.has(book.id);
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const body = error.error;
      if (typeof body === 'string') return body || fallback;
      if (typeof body === 'object' && body !== null) {
        if ('error' in body && typeof body.error === 'string') return body.error;
        if ('message' in body && typeof body.message === 'string') return body.message;
      }
    }
    return fallback;
  }
}
