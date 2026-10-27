import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { BookService } from '../../../../services/services/book.service';
import { BorrowedBookList } from './borrowed-book-list';

describe('BorrowedBookList', () => {
  let component: BorrowedBookList;
  let fixture: ComponentFixture<BorrowedBookList>;
  let bookService: jasmine.SpyObj<BookService>;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj<BookService>(
      'BookService',
      ['findAllBorrowedBooks', 'returnBorrowedBook']
    );
    bookService.findAllBorrowedBooks.and.returnValue(of({
      content: [],
      number: 0,
      totalPages: 0,
      totalElements: 0
    }));
    bookService.returnBorrowedBook.and.returnValue(of(1));

    await TestBed.configureTestingModule({
      imports: [BorrowedBookList],
      providers: [{ provide: BookService, useValue: bookService }]
    }).compileComponents();

    fixture = TestBed.createComponent(BorrowedBookList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads borrowed books on initialization', () => {
    expect(bookService.findAllBorrowedBooks).toHaveBeenCalledWith({ page: 0, size: 8 });
    expect(component.isLoading).toBeFalse();
  });

  it('marks a borrowed book as returned and updates its displayed status', () => {
    const book = { id: 14, title: 'The Hobbit', returned: false, returnApproved: false };
    component.borrowedBooks = { content: [book], totalPages: 1 };

    component.markAsReturned(book);

    expect(bookService.returnBorrowedBook).toHaveBeenCalledWith({ 'book-id': 14 });
    expect(component.books[0].returned).toBeTrue();
    expect(component.message).toContain('Return requested for "The Hobbit"');
  });

  it('does not submit a return request twice for the same pending book', () => {
    const book = { id: 14, returned: false, returnApproved: false };
    component.pendingBookId = 14;

    component.markAsReturned(book);

    expect(bookService.returnBorrowedBook).not.toHaveBeenCalled();
  });

  it('shows backend errors when a return request fails', () => {
    const book = { id: 14, returned: false, returnApproved: false };
    component.borrowedBooks = { content: [book], totalPages: 1 };
    bookService.returnBorrowedBook.and.returnValue(
      throwError(() => ({ error: { error: 'You did not borrow this book.' } }))
    );

    component.markAsReturned(book);

    expect(component.messageLevel).toBe('error');
    expect(component.message).toBe('You did not borrow this book.');
    expect(component.pendingBookId).toBeNull();
  });

  it('guards pagination boundaries', () => {
    component.borrowedBooks = { content: [], totalPages: 2 };
    component.goToPreviousPage();

    expect(bookService.findAllBorrowedBooks).toHaveBeenCalledTimes(1);
    component.goToNextPage();

    expect(component.page).toBe(1);
    expect(bookService.findAllBorrowedBooks).toHaveBeenCalledWith({ page: 1, size: 8 });
  });
});
