import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BookRequest} from '../../../../services/models/book-request';
import {Router, RouterLink} from '@angular/router';
import {BookService} from '../../../../services/services/book.service';

@Component({
  selector: 'app-manage-book',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './manage-book.html',
  styleUrl: './manage-book.scss',
  standalone: true
})
export class ManageBook {
  errorMsg: Array<string> = [];
  selectedBookCover:any;
  selectedPicture: string | undefined;
  bookRequest: BookRequest = {
    authorName: "",
    isbn: "",
    synopsis: "",
    title: "",
    shareable: true
  };
  constructor(
    private bookService: BookService,
    private router: Router,
  ) {
  }
  onfileSelected(event: any) {
    this.selectedBookCover = event.target.files[0];
    console.log(this.selectedBookCover);
    if(this.selectedBookCover) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.selectedPicture = reader.result as string;
      }
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  saveBook() {
    this.bookService.saveBook({
      body: this.bookRequest
    }).subscribe({
      next: (bookId) => {
        this.bookService.uploadBookCoverPicture({
          'book-id': bookId,
          body: {
            file: this.selectedBookCover
          }
        }).subscribe({
          next: () => {
            this.router.navigate(['/books/my-books']);
          }
        });
      },
      error: (err) => {
        console.log(err.error);
        this.errorMsg = err.error.validationErrors;
      }
    });
  }
}
//todo-> the file don't saved , resolve
