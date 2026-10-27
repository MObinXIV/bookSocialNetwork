package com.mobin.booknetworkapi.book;

import com.mobin.booknetworkapi.common.PageResponse;
import com.mobin.booknetworkapi.exception.OperationNotPermittedException;
import com.mobin.booknetworkapi.file.FileStorageService;
import com.mobin.booknetworkapi.history.BookTransactionHistory;
import com.mobin.booknetworkapi.history.BookTransactionHistoryRepository;
import com.mobin.booknetworkapi.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static com.mobin.booknetworkapi.book.BookSpecification.withOwner;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookMapper bookMapper;
    private final BookRepository bookRepository;
    private final BookTransactionHistoryRepository historyRepository;
    private final FileStorageService fileStorageService;
    public Integer save(BookRequest request,Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Book book;
        if (request.id() == null) {
            book = bookMapper.toBook(request);
            book.setOwner(user);
        } else {
            book = bookRepository.findById(request.id())
                    .orElseThrow(() -> new EntityNotFoundException("Book not found with ID: " + request.id()));
            if (!Objects.equals(book.getOwner().getId(), user.getId())) {
                throw new OperationNotPermittedException("You cannot update others' books");
            }
            book.setTitle(request.title());
            book.setAuthorName(request.authorName());
            book.setIsbn(request.isbn());
            book.setSynopsis(request.synopsis());
            book.setShareable(request.shareable());
        }
        return bookRepository.save(book).getId();
    }

    public BookResponse findById(Integer bookId) {
        return bookRepository.findById(bookId)
                .map(bookMapper::toBookResponse)
                .orElseThrow(()-> new EntityNotFoundException("No Book Found with ID:: "+bookId));
    }

    public PageResponse<BookResponse> findAllBooks(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable= PageRequest.of(page,size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAllDisplayableBooks(pageable,user.getId());
        List<BookResponse>bookResponse= books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
        return new PageResponse<>(
                bookResponse,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    public PageResponse<BookResponse> findAllBooksByOwner(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable= PageRequest.of(page,size, Sort.by("createdDate").descending());
        Page<Book> books = bookRepository.findAll(withOwner(user.getId()),pageable);
        List<BookResponse>bookResponse= books.stream()
                .map(bookMapper::toBookResponse)
                .toList();
        return new PageResponse<>(
                bookResponse,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    public PageResponse<BorrowedBookResponse> findAllBorrowedBooks(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable= PageRequest.of(page,size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allBorrowedBooks= historyRepository.findAllBorrowedBooks(pageable,user.getId());
        List<BorrowedBookResponse> bookResponse = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();
        return new PageResponse<>(
                bookResponse,
                allBorrowedBooks.getNumber(),
                allBorrowedBooks.getSize(),
                allBorrowedBooks.getTotalElements(),
                allBorrowedBooks.getTotalPages(),
                allBorrowedBooks.isFirst(),
                allBorrowedBooks.isLast()
        );
    }

    public PageResponse<BorrowedBookResponse> findAllReturnedBooks(int page, int size, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Pageable pageable= PageRequest.of(page,size, Sort.by("createdDate").descending());
        Page<BookTransactionHistory> allBorrowedBooks= historyRepository.findAllReturnedBooks(pageable,user.getId());
        List<BorrowedBookResponse> bookResponse = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();
        return new PageResponse<>(
                bookResponse,
                allBorrowedBooks.getNumber(),
                allBorrowedBooks.getSize(),
                allBorrowedBooks.getTotalElements(),
                allBorrowedBooks.getTotalPages(),
                allBorrowedBooks.isFirst(),
                allBorrowedBooks.isLast()
        );
    }

    public Integer updateShareableStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId).orElseThrow(()-> new EntityNotFoundException("Book not found with ID: "+bookId));
        User user = ((User) connectedUser.getPrincipal());
        // check if the current user the owner of the book or not , as if he 's not we 'll disallow him
        if(!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot update others shareable status");
        }
        book.setShareable(!book.isShareable());
        bookRepository.save(book);
        return bookId;
    }


    public Integer updateArchivedStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId).orElseThrow(()-> new EntityNotFoundException("Book not found with ID: "+bookId));
        User user = ((User) connectedUser.getPrincipal());
        // check if the current user the owner of the book or not , as if he 's not we 'll disallow him
        if(!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot update others archived status");
        }
        book.setArchived(!book.isArchived());
        bookRepository.save(book);
        return bookId;
    }

    public Integer borrowBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId).orElseThrow(()-> new EntityNotFoundException("Book not found with ID: "+bookId));
        User user = ((User) connectedUser.getPrincipal());
        // let's check our bad scenarios
        // case the book archived or not shared
        if(book.isArchived() || !book.isShareable()){
            throw new OperationNotPermittedException("You cannot borrow this book,since it is archived or not shareable");
        }
        // case the owner of the book is the borrowed
        if(Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot borrow your own book");
        }
        // A book represents one physical copy, so it remains unavailable until its return is approved.
        if (historyRepository.isCurrentlyBorrowed(bookId)) {
            throw new OperationNotPermittedException("The requested book is already borrowed");
        }
        BookTransactionHistory bookTransactionHistory = BookTransactionHistory.builder()
                .user(user)
                .book(book)
                .returned(false)
                .returnApproved(false)
                .build();
        return historyRepository.save(bookTransactionHistory).getId();
    }

    public Integer returnBorrowedBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId).orElseThrow(()-> new EntityNotFoundException("Book not found with ID: "+bookId));
        User user = ((User) connectedUser.getPrincipal());
        // let's check our bad scenarios
        // case the book archived or not shared
        if(book.isArchived() || !book.isShareable()){
            throw new OperationNotPermittedException("You cannot borrow this book,since it is archived or not shareable");
        }
        if(Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot borrow or your own book");
        }
        // check if the user 've even borrowed this book
         BookTransactionHistory transactionHistory = historyRepository.findByBookIdAndUserId(bookId,user.getId())
                 .orElseThrow(()-> new OperationNotPermittedException("You didn't borrow this book"));
        transactionHistory.setReturned(true);
        return historyRepository.save(transactionHistory).getId();
    }

    public Integer approveReturnBorrowedBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId).orElseThrow(()-> new EntityNotFoundException("Book not found with ID: "+bookId));
        User user = ((User) connectedUser.getPrincipal());
        if(!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot approve the return of another owner's book");
        }
        List<BookTransactionHistory> pendingReturns = historyRepository.findAllByBookIdAndOwnerId(bookId, user.getId());
        if (pendingReturns.isEmpty()) {
            throw new OperationNotPermittedException("The book isn't returned yet, you can't approve its return");
        }

        pendingReturns.forEach(history -> history.setReturnApproved(true));
        historyRepository.saveAll(pendingReturns);
        return pendingReturns.get(0).getId();
    }

    public void uploadBookCoverPicture(MultipartFile file, Authentication connectedUser, Integer bookId) {
        Book book = bookRepository.findById(bookId).orElseThrow(()-> new EntityNotFoundException("Book not found with ID: "+bookId));
        User user = ((User) connectedUser.getPrincipal());
        if (!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot update others' books cover picture");
        }
        var bookCover = fileStorageService.saveFile(file,user.getId()); // upload the file in the server for specific user
        book.setBookCover(bookCover);
        bookRepository.save(book);
    }
}
