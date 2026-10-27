import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BorrowedBookResponse } from '../../../../services/models/borrowed-book-response';
import { PageResponseBorrowedBookResponse } from '../../../../services/models/page-response-borrowed-book-response';
import { BookService } from '../../../../services/services/book.service';

@Component({
  selector: 'app-borrowed-book-list',
  imports: [RouterLink],
  templateUrl: './borrowed-book-list.html',
  styleUrl: './borrowed-book-list.scss',
  standalone: true
})
export class BorrowedBookList implements OnInit {
  borrowedBooks: PageResponseBorrowedBookResponse = { content: [] };
  page = 0;
  readonly size = 8;
  isLoading = true;
  loadError = '';
  message = '';
  messageLevel: 'success' | 'error' = 'success';
  pendingBookId: number | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBorrowedBooks();
  }

  get books(): BorrowedBookResponse[] {
    return this.borrowedBooks.content ?? [];
  }

  get totalPages(): number {
    return this.borrowedBooks.totalPages ?? 0;
  }

  get isLastPage(): boolean {
    return this.totalPages === 0 || this.page >= this.totalPages - 1;
  }

  loadBorrowedBooks(): void {
    this.isLoading = true;
    this.loadError = '';
    this.bookService.findAllBorrowedBooks({ page: this.page, size: this.size }).subscribe({
      next: response => {
        this.borrowedBooks = response;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.loadError = this.getErrorMessage(error, 'Your borrowed books could not be loaded.');
      }
    });
  }

  markAsReturned(book: BorrowedBookResponse): void {
    if (book.id === undefined || book.returned || book.returnApproved || this.pendingBookId !== null) {
      return;
    }

    this.pendingBookId = book.id;
    this.message = '';
    this.bookService.returnBorrowedBook({ 'book-id': book.id }).subscribe({
      next: () => {
        this.pendingBookId = null;
        this.borrowedBooks = {
          ...this.borrowedBooks,
          content: this.books.map(item => item.id === book.id ? { ...item, returned: true } : item)
        };
        this.messageLevel = 'success';
        this.message = `Return requested for "${book.title || 'this book'}". It will be marked complete after the owner approves it.`;
      },
      error: error => {
        this.pendingBookId = null;
        this.messageLevel = 'error';
        this.message = this.getErrorMessage(error, 'Your return could not be submitted. Please try again.');
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
    this.loadBorrowedBooks();
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    const response = error as { error?: { error?: string; message?: string } };
    return response.error?.error || response.error?.message || fallback;
  }
}
