import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageResponseBorrowedBookResponse } from '../../../../services/models/page-response-borrowed-book-response';
import { BorrowedBookResponse } from '../../../../services/models/borrowed-book-response';
import { BookService } from '../../../../services/services/book.service';

@Component({
  selector: 'app-return-books',
  imports: [RouterLink],
  templateUrl: './return-books.html',
  styleUrl: './return-books.scss',
  standalone: true
})
export class ReturnBooks implements OnInit {
  returnedBooks: PageResponseBorrowedBookResponse = { content: [] };
  page = 0;
  readonly size = 8;
  isLoading = true;
  loadError = '';
  message = '';
  messageLevel: 'success' | 'error' = 'success';
  pendingBookId: number | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadReturnedBooks();
  }

  get books(): BorrowedBookResponse[] {
    return this.returnedBooks.content ?? [];
  }

  get totalPages(): number {
    return this.returnedBooks.totalPages ?? 0;
  }

  get isLastPage(): boolean {
    return this.totalPages === 0 || this.page >= this.totalPages - 1;
  }

  loadReturnedBooks(): void {
    this.isLoading = true;
    this.loadError = '';
    this.bookService.findAllReturnedBooks({ page: this.page, size: this.size }).subscribe({
      next: response => {
        this.returnedBooks = response;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.loadError = this.getErrorMessage(error, 'Returned books could not be loaded.');
      }
    });
  }

  approveReturn(book: BorrowedBookResponse): void {
    if (
      book.id === undefined ||
      !book.returned ||
      book.returnApproved ||
      this.pendingBookId !== null
    ) {
      return;
    }

    this.pendingBookId = book.id;
    this.message = '';
    this.bookService.approveReturnBorrowedBook({ 'book-id': book.id }).subscribe({
      next: () => {
        this.pendingBookId = null;
        this.returnedBooks = {
          ...this.returnedBooks,
          content: this.books.map(item =>
            item.id === book.id ? { ...item, returnApproved: true } : item
          )
        };
        this.messageLevel = 'success';
        this.message = `All pending returns for "${book.title || 'this book'}" have been approved.`;
      },
      error: error => {
        this.pendingBookId = null;
        this.messageLevel = 'error';
        this.message = this.getErrorMessage(
          error,
          'The return could not be approved. Please try again.'
        );
      }
    });
  }

  goToFirstPage(): void {
    this.goToPage(0);
  }

  goToPreviousPage(): void {
    this.goToPage(this.page - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.page + 1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages - 1);
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.page || this.isLoading) {
      return;
    }
    this.page = page;
    this.message = '';
    this.loadReturnedBooks();
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const response = error as { error?: { error?: string; message?: string } | string };
      if (typeof response.error === 'string') {
        return response.error || fallback;
      }
      return response.error?.error || response.error?.message || fallback;
    }
    return fallback;
  }
}
