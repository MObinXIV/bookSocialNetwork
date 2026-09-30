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
  private _bookCover: string | undefined;
  private _manage = false;
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
    if(this._bookCover){
      return 'data:image/jpg;base64,' + this._bookCover;
    }
    return 'https://placehold.co/200x300?text=No+Cover';
  }
  @Output() private share: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private archive: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  onShowDetails() {
    this.details.emit(this._book);
  }

  onBorrow() {
    this.borrow.emit(this._book);
  }

  onAddToWaitingList() {
    this.addToWaitingList.emit(this._book);
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
