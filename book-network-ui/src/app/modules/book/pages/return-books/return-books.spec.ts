import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { BookService } from '../../../../services/services/book.service';
import { ReturnBooks } from './return-books';

describe('ReturnBooks', () => {
  let component: ReturnBooks;
  let fixture: ComponentFixture<ReturnBooks>;
  let bookService: jasmine.SpyObj<BookService>;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj<BookService>(
      'BookService',
      ['findAllReturnedBooks', 'approveReturnBorrowedBook']
    );
    bookService.findAllReturnedBooks.and.returnValue(of({
      content: [],
      number: 0,
      totalPages: 0,
      totalElements: 0
    }));
    bookService.approveReturnBorrowedBook.and.returnValue(of(1));

    await TestBed.configureTestingModule({
      imports: [ReturnBooks],
      providers: [{ provide: BookService, useValue: bookService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads returned books on initialization', () => {
    expect(bookService.findAllReturnedBooks).toHaveBeenCalledWith({ page: 0, size: 8 });
    expect(component.isLoading).toBeFalse();
  });

  it('approves a pending return and updates its displayed status', () => {
    const book = { id: 14, title: 'The Hobbit', returned: true, returnApproved: false };
    component.returnedBooks = { content: [book], totalPages: 1 };

    component.approveReturn(book);

    expect(bookService.approveReturnBorrowedBook).toHaveBeenCalledWith({ 'book-id': 14 });
    expect(component.books[0].returnApproved).toBeTrue();
    expect(component.message).toBe('Return approved for "The Hobbit".');
    expect(component.pendingBookId).toBeNull();
  });

  it('does not approve a return that is not pending or already approved', () => {
    component.approveReturn({ id: 14, returned: false, returnApproved: false });
    component.approveReturn({ id: 15, returned: true, returnApproved: true });

    expect(bookService.approveReturnBorrowedBook).not.toHaveBeenCalled();
  });

  it('shows the server error when an approval fails', () => {
    const book = { id: 14, returned: true, returnApproved: false };
    bookService.approveReturnBorrowedBook.and.returnValue(
      throwError(() => ({ error: { error: 'The book is not awaiting approval.' } }))
    );

    component.approveReturn(book);

    expect(component.messageLevel).toBe('error');
    expect(component.message).toBe('The book is not awaiting approval.');
    expect(component.pendingBookId).toBeNull();
  });

  it('guards pagination boundaries', () => {
    component.returnedBooks = { content: [], totalPages: 2 };
    component.goToPreviousPage();

    expect(bookService.findAllReturnedBooks).toHaveBeenCalledTimes(1);
    component.goToNextPage();

    expect(component.page).toBe(1);
    expect(bookService.findAllReturnedBooks).toHaveBeenCalledWith({ page: 1, size: 8 });
  });
});
