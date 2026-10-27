import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BookService } from '../../../../services/services/book.service';
import { FeedbackService } from '../../../../services/services/feedback.service';
import { BookDetails } from './book-details';

describe('BookDetails', () => {
  let component: BookDetails;
  let fixture: ComponentFixture<BookDetails>;
  let feedbackService: jasmine.SpyObj<FeedbackService>;

  beforeEach(async () => {
    feedbackService = jasmine.createSpyObj<FeedbackService>('FeedbackService', [
      'findAllFeedbackByBook',
      'saveFeedback'
    ]);
    feedbackService.findAllFeedbackByBook.and.returnValue(of({
      content: [{ comment: 'A thoughtful read', note: 4, ownFeedback: false }],
      totalPages: 1
    }));
    feedbackService.saveFeedback.and.returnValue(of(1));

    const bookService = jasmine.createSpyObj<BookService>('BookService', ['findBookById']);
    bookService.findBookById.and.returnValue(of({
      id: 12,
      title: 'A sample title',
      authorName: 'Sample author',
      rate: 4
    }));

    await TestBed.configureTestingModule({
      imports: [BookDetails],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '12' } } } },
        { provide: BookService, useValue: bookService },
        { provide: FeedbackService, useValue: feedbackService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads the book and its feedback', () => {
    expect(component.book?.title).toBe('A sample title');
    expect(component.feedback[0].comment).toBe('A thoughtful read');
  });

  it('submits a valid review and refreshes the displayed data', () => {
    component.comment = 'I enjoyed this book.';
    component.note = 5;

    component.submitFeedback();

    expect(feedbackService.saveFeedback).toHaveBeenCalledWith({
      body: { bookId: 12, comment: 'I enjoyed this book.', note: 5 }
    });
    expect(component.feedbackMessage).toBe('Your feedback has been submitted.');
    expect(component.comment).toBe('');
    expect(feedbackService.findAllFeedbackByBook).toHaveBeenCalledTimes(2);
  });
});
