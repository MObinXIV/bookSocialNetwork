import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { BookResponse } from '../../../../services/models/book-response';
import { BookService } from '../../../../services/services/book.service';
import { MyBooks } from './my-books';

describe('MyBooks', () => {
  let component: MyBooks;
  let fixture: ComponentFixture<MyBooks>;
  let bookService: jasmine.SpyObj<BookService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj<BookService>(
      'BookService',
      ['findBooksByOwner', 'updateArchivedStatus', 'updateSharableStatus']
    );
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    bookService.findBooksByOwner.and.returnValue(of({ content: [], totalPages: 0 }));
    bookService.updateArchivedStatus.and.returnValue(of(1));
    bookService.updateSharableStatus.and.returnValue(of(1));

    await TestBed.configureTestingModule({
      imports: [MyBooks],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to the selected book edit form', () => {
    component.editBook({ id: 12 });

    expect(router.navigate).toHaveBeenCalledWith(['/books/manage', 12]);
  });

  it('toggles archived status and refreshes the owned books', () => {
    const book: BookResponse = { id: 12, archived: false };

    component.archiveBook(book);

    expect(bookService.updateArchivedStatus).toHaveBeenCalledWith({ 'book-id': 12 });
    expect(component.message).toBe('Book archived.');
    expect(bookService.findBooksByOwner).toHaveBeenCalledTimes(2);
  });

  it('toggles the book availability status', () => {
    const book: BookResponse = { id: 12, shareable: true };

    component.shareBook(book);

    expect(bookService.updateSharableStatus).toHaveBeenCalledWith({ 'book-id': 12 });
    expect(component.message).toBe('Book is no longer available to borrow.');
  });
});
