package com.mobin.booknetworkapi.book;

import com.mobin.booknetworkapi.exception.OperationNotPermittedException;
import com.mobin.booknetworkapi.file.FileStorageService;
import com.mobin.booknetworkapi.history.BookTransactionHistory;
import com.mobin.booknetworkapi.history.BookTransactionHistoryRepository;
import com.mobin.booknetworkapi.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class BookServiceTest {
    private BookRepository bookRepository;
    private BookTransactionHistoryRepository historyRepository;
    private BookService bookService;
    private Authentication authentication;
    private User owner;

    @BeforeEach
    void setUp() {
        bookRepository = mock(BookRepository.class);
        historyRepository = mock(BookTransactionHistoryRepository.class);
        authentication = mock(Authentication.class);
        owner = mock(User.class);

        bookService = new BookService(
                new BookMapper(),
                bookRepository,
                historyRepository,
                mock(FileStorageService.class)
        );
    }

    @Test
    void approvesAllPendingReturnsForBook() {
        int bookId = 12;
        int ownerId = 34;
        Book book = mock(Book.class);
        User authenticatedUser = mock(User.class);
        BookTransactionHistory firstReturn = mock(BookTransactionHistory.class);
        BookTransactionHistory secondReturn = mock(BookTransactionHistory.class);

        when(authentication.getPrincipal()).thenReturn(authenticatedUser);
        when(authenticatedUser.getId()).thenReturn(ownerId);
        when(book.getOwner()).thenReturn(owner);
        when(owner.getId()).thenReturn(ownerId);
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        when(historyRepository.findAllByBookIdAndOwnerId(bookId, ownerId))
                .thenReturn(List.of(firstReturn, secondReturn));
        when(firstReturn.getId()).thenReturn(71);

        assertEquals(71, bookService.approveReturnBorrowedBook(bookId, authentication));

        verify(firstReturn).setReturnApproved(true);
        verify(secondReturn).setReturnApproved(true);
        verify(historyRepository).saveAll(List.of(firstReturn, secondReturn));
    }

    @Test
    void rejectsApprovalWhenNoPendingReturnsExist() {
        int bookId = 12;
        int ownerId = 34;
        Book book = mock(Book.class);
        User authenticatedUser = mock(User.class);

        when(authentication.getPrincipal()).thenReturn(authenticatedUser);
        when(authenticatedUser.getId()).thenReturn(ownerId);
        when(book.getOwner()).thenReturn(owner);
        when(owner.getId()).thenReturn(ownerId);
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        when(historyRepository.findAllByBookIdAndOwnerId(bookId, ownerId)).thenReturn(List.of());

        assertThrows(
                OperationNotPermittedException.class,
                () -> bookService.approveReturnBorrowedBook(bookId, authentication)
        );
        verify(historyRepository, never()).saveAll(anyList());
    }

    @Test
    void preventsBorrowingBookUntilPendingReturnIsApproved() {
        int bookId = 12;
        Book book = mock(Book.class);
        User borrower = mock(User.class);

        when(authentication.getPrincipal()).thenReturn(borrower);
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        when(book.getOwner()).thenReturn(owner);
        when(owner.getId()).thenReturn(1);
        when(borrower.getId()).thenReturn(2);
        when(book.isShareable()).thenReturn(true);
        when(historyRepository.isCurrentlyBorrowed(bookId)).thenReturn(true);

        assertThrows(
                OperationNotPermittedException.class,
                () -> bookService.borrowBook(bookId, authentication)
        );
        verify(historyRepository, never()).save(any(BookTransactionHistory.class));
    }
}
