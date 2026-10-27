import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookResponse } from '../../../../services/models/book-response';
import {Rating} from '../rating/rating';

@Component({
  selector: 'app-book-card',
  imports: [CommonModule, Rating],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
  standalone: true
})
export class BookCard {
  private _book: BookResponse = {};
  private _manage = false;
  @Input() isBorrowPending = false;
  @Input() isBorrowed = false;
  get manage(): boolean {
    return this._manage;
  }

  @Input()
  set manage(value: boolean) {
    this._manage = value;
  }
  get book(): BookResponse { return this._book; }

  @Input() set book(value: BookResponse) { this._book = value; }



  get bookCover(): string | undefined {
    return this._book.cover
      ? `data:image/jpeg;base64,${this._book.cover}`
      : 'https://placehold.co/400x560?text=Book+Cover';
  }
  @Output() private share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  onShowDetails() {
    this.details.emit(this._book);
  }

  onBorrow() {
    this.borrow.emit(this._book);
  }

  onEdit() {
    this.edit.emit(this._book);
  }

  onShare() {
    this.share.emit(this._book);
  }

  onArchive() {
    this.archive.emit(this._book);
  }
}
