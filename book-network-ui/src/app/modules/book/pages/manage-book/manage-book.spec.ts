import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BookResponse } from '../../../../services/models/book-response';
import { BookService } from '../../../../services/services/book.service';
import { ManageBook } from './manage-book';

describe('ManageBook', () => {
  let component: ManageBook;
  let fixture: ComponentFixture<ManageBook>;
  let bookService: jasmine.SpyObj<BookService>;
  let router: jasmine.SpyObj<Router>;
  let routeBookId: string | null;

  beforeEach(async () => {
    routeBookId = null;
    bookService = jasmine.createSpyObj<BookService>(
      'BookService',
      ['findBookById', 'saveBook', 'uploadBookCoverPicture']
    );
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    bookService.findBookById.and.returnValue(of({}));
    bookService.saveBook.and.returnValue(of(123));
    bookService.uploadBookCoverPicture.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ManageBook],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => routeBookId } } }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('saves a book without attempting a cover upload when no cover is selected', () => {
    component.saveBook();

    expect(bookService.saveBook).toHaveBeenCalled();
    expect(bookService.uploadBookCoverPicture).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/books/my-books']);
  });

  it('uploads the selected cover after saving the book', () => {
    const cover = new File(['cover'], 'cover.png', { type: 'image/png' });
    component.selectedBookCover = cover;

    component.saveBook();

    expect(bookService.uploadBookCoverPicture).toHaveBeenCalledWith({
      'book-id': 123,
      body: { file: cover }
    });
    expect(router.navigate).toHaveBeenCalledWith(['/books/my-books']);
  });

  it('loads the book into the form when an ID is present in the route', () => {
    const book: BookResponse = {
      id: 42,
      title: 'The Hobbit',
      authorName: 'J. R. R. Tolkien',
      isbn: '9780007525492',
      synopsis: 'A hobbit goes on an adventure.',
      shareable: false,
      cover: 'aGVsbG8='
    };
    routeBookId = '42';
    bookService.findBookById.and.returnValue(of(book));

    component.ngOnInit();

    expect(bookService.findBookById).toHaveBeenCalledWith({ 'book-id': 42 });
    expect(component.bookRequest).toEqual({
      id: 42,
      title: 'The Hobbit',
      authorName: 'J. R. R. Tolkien',
      isbn: '9780007525492',
      synopsis: 'A hobbit goes on an adventure.',
      shareable: false
    });
    expect(component.selectedPicture).toContain('base64,aGVsbG8=');
  });

  it('saves edits with the current book ID and ISBN', () => {
    component.bookId = 42;
    component.isEditMode = true;
    component.bookRequest = {
      id: 42,
      title: 'The Hobbit',
      authorName: 'J. R. R. Tolkien',
      isbn: '9780007525492',
      synopsis: 'Updated synopsis',
      shareable: true
    };

    component.saveBook();

    expect(bookService.saveBook).toHaveBeenCalledWith({ body: component.bookRequest });
    expect(bookService.uploadBookCoverPicture).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/books/my-books']);
  });
});
