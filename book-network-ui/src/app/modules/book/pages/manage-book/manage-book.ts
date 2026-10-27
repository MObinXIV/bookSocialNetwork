import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookRequest } from '../../../../services/models/book-request';
import { BookService } from '../../../../services/services/book.service';

@Component({
  selector: 'app-manage-book',
  imports: [FormsModule, RouterLink],
  templateUrl: './manage-book.html',
  styleUrl: './manage-book.scss',
  standalone: true
})
export class ManageBook implements OnInit {
  errorMsg: string[] = [];
  selectedBookCover: File | null = null;
  selectedPicture: string | undefined;
  isLoading = false;
  isSaving = false;
  bookSaved = false;
  isEditMode = false;
  isBookLoaded = false;
  bookId: number | null = null;
  bookRequest: BookRequest = this.emptyBookRequest();

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('bookId');
    if (idParam === null) {
      return;
    }
    this.isEditMode = true;

    const bookId = Number(idParam);
    if (!Number.isInteger(bookId) || bookId <= 0) {
      this.errorMsg = ['The book ID is invalid.'];
      return;
    }

    this.bookId = bookId;
    this.isLoading = true;
    this.bookService.findBookById({ 'book-id': bookId }).subscribe({
      next: book => {
        if (book.id !== bookId) {
          this.errorMsg = ['The requested book could not be loaded.'];
          this.isLoading = false;
          return;
        }

        this.bookRequest = {
          id: book.id,
          title: book.title ?? '',
          authorName: book.authorName ?? '',
          isbn: book.isbn ?? '',
          synopsis: book.synopsis ?? '',
          shareable: book.shareable ?? true
        };
        this.selectedPicture = this.coverDataUrl(book.cover);
        this.isBookLoaded = true;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.setErrorMessages(error, 'The book could not be loaded. Please return to your books and try again.');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.errorMsg = [];
    this.selectedBookCover = null;

    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.errorMsg = ['Please select an image file for the book cover.'];
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.selectedBookCover = file;
        this.selectedPicture = reader.result;
      } else {
        this.errorMsg = ['The selected cover could not be previewed. Please try another image.'];
        input.value = '';
      }
    };
    reader.onerror = () => {
      this.errorMsg = ['The selected cover could not be previewed. Please try another image.'];
      this.selectedBookCover = null;
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  saveBook(): void {
    if (this.isSaving || this.isLoading || (this.isEditMode && !this.isBookLoaded)) {
      return;
    }

    this.errorMsg = [];
    this.isSaving = true;
    this.bookService.saveBook({ body: this.bookRequest }).subscribe({
      next: bookId => {
        this.bookId = bookId;
        this.bookRequest.id = bookId;
        this.bookSaved = true;
        if (!this.selectedBookCover) {
          this.navigateToMyBooks();
          return;
        }

        this.uploadCover(bookId);
      },
      error: error => {
        this.isSaving = false;
        this.setErrorMessages(error, 'The book could not be saved. Please try again.');
      }
    });
  }

  private uploadCover(bookId: number): void {
    if (!this.selectedBookCover) {
      this.navigateToMyBooks();
      return;
    }

    this.bookService.uploadBookCoverPicture({
      'book-id': bookId,
      body: { file: this.selectedBookCover }
    }).subscribe({
      next: () => this.navigateToMyBooks(),
      error: error => {
        this.isSaving = false;
        this.setErrorMessages(error, 'The book was saved, but its cover could not be uploaded. Retry or return to your books without a cover.');
      }
    });
  }

  private navigateToMyBooks(): void {
    this.router.navigate(['/books/my-books']);
  }

  private coverDataUrl(cover: string | undefined): string | undefined {
    if (!cover) {
      return undefined;
    }

    let mimeType = 'image/jpeg';
    try {
      const signature = atob(cover.slice(0, 16));
      if (signature.startsWith('\x89PNG\r\n\x1a\n')) {
        mimeType = 'image/png';
      } else if (signature.startsWith('GIF8')) {
        mimeType = 'image/gif';
      } else if (signature.slice(0, 4) === 'RIFF' && signature.slice(8, 12) === 'WEBP') {
        mimeType = 'image/webp';
      }
    } catch {
      this.errorMsg = ['The saved book cover could not be displayed.'];
    }
    return `data:${mimeType};base64,${cover}`;
  }

  private emptyBookRequest(): BookRequest {
    return {
      authorName: '',
      isbn: '',
      synopsis: '',
      title: '',
      shareable: true
    };
  }

  private setErrorMessages(error: unknown, fallback: string): void {
    const response = error as { error?: { validationErrors?: unknown; error?: string } };
    const validationErrors = response.error?.validationErrors;
    if (
      Array.isArray(validationErrors)
      && validationErrors.length > 0
      && validationErrors.every(message => typeof message === 'string')
    ) {
      this.errorMsg = validationErrors;
      return;
    }
    this.errorMsg = [response.error?.error || fallback];
  }
}
