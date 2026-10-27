import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookResponse } from '../../../../services/models/book-response';
import { FeedbackResponse } from '../../../../services/models/feedback-response';
import { PageResponseFeedbackResponse } from '../../../../services/models/page-response-feedback-response';
import { BookService } from '../../../../services/services/book.service';
import { FeedbackService } from '../../../../services/services/feedback.service';
import { Rating } from '../../components/rating/rating';

@Component({
  selector: 'app-book-details',
  imports: [FormsModule, Rating, RouterLink],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss',
  standalone: true
})
export class BookDetails implements OnInit {
  book: BookResponse | null = null;
  bookId = 0;
  isLoadingBook = true;
  bookError = '';
  feedbackPage: PageResponseFeedbackResponse = { content: [] };
  page = 0;
  readonly size = 5;
  isLoadingFeedback = true;
  feedbackError = '';
  feedbackMessage = '';
  feedbackMessageLevel: 'success' | 'error' = 'success';
  comment = '';
  note = 5;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('bookId'));
    if (!Number.isInteger(bookId) || bookId <= 0) {
      this.bookError = 'The requested book ID is invalid.';
      this.isLoadingBook = false;
      this.isLoadingFeedback = false;
      return;
    }

    this.bookId = bookId;
    this.loadBook();
    this.loadFeedback();
  }

  get feedback(): FeedbackResponse[] {
    return this.feedbackPage.content ?? [];
  }

  get totalPages(): number {
    return this.feedbackPage.totalPages ?? 0;
  }

  get isLastPage(): boolean {
    return this.totalPages === 0 || this.page >= this.totalPages - 1;
  }

  loadBook(): void {
    this.isLoadingBook = true;
    this.bookError = '';
    this.bookService.findBookById({ 'book-id': this.bookId }).subscribe({
      next: book => {
        this.book = book;
        this.isLoadingBook = false;
      },
      error: error => {
        this.bookError = this.getErrorMessage(error, 'The book could not be loaded.');
        this.isLoadingBook = false;
      }
    });
  }

  loadFeedback(): void {
    this.isLoadingFeedback = true;
    this.feedbackError = '';
    this.feedbackService.findAllFeedbackByBook({
      'book-id': this.bookId,
      page: this.page,
      size: this.size
    }).subscribe({
      next: response => {
        this.feedbackPage = response;
        this.isLoadingFeedback = false;
      },
      error: error => {
        this.feedbackError = this.getErrorMessage(error, 'Feedback could not be loaded.');
        this.isLoadingFeedback = false;
      }
    });
  }

  submitFeedback(): void {
    if (this.isSubmitting) return;
    const comment = this.comment.trim();
    if (!comment) {
      this.feedbackMessageLevel = 'error';
      this.feedbackMessage = 'Please enter a comment before submitting.';
      return;
    }
    if (!Number.isInteger(this.note) || this.note < 1 || this.note > 5) {
      this.feedbackMessageLevel = 'error';
      this.feedbackMessage = 'Choose a rating from 1 to 5.';
      return;
    }

    this.isSubmitting = true;
    this.feedbackMessage = '';
    this.feedbackService.saveFeedback({
      body: { bookId: this.bookId, comment, note: this.note }
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.comment = '';
        this.page = 0;
        this.feedbackMessageLevel = 'success';
        this.feedbackMessage = 'Your feedback has been submitted.';
        this.loadFeedback();
        this.loadBook();
      },
      error: error => {
        this.isSubmitting = false;
        this.feedbackMessageLevel = 'error';
        this.feedbackMessage = this.getErrorMessage(error, 'Your feedback could not be submitted.');
      }
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.page || this.isLoadingFeedback) return;
    this.page = page;
    this.loadFeedback();
  }

  get cover(): string {
    return this.book?.cover
      ? `data:image/jpeg;base64,${this.book.cover}`
      : 'https://placehold.co/400x560?text=Book+Cover';
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const body: unknown = error.error;
      if (typeof body === 'string') return body || fallback;
      if (typeof body === 'object' && body !== null) {
        if ('error' in body && typeof body.error === 'string') return body.error;
        if ('message' in body && typeof body.message === 'string') return body.message;
      }
    }
    return fallback;
  }
}
