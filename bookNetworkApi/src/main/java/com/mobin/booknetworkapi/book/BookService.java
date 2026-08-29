package com.mobin.booknetworkapi.book;

import com.mobin.booknetworkapi.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookMapper bookMapper;
    private final BookRepository bookRepository;
    public Integer save(BookRequest request,Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        Book book= bookMapper.toBook(request);
        book.setOwner(user);// set the book to the current connected user
        return bookRepository.save(book).getId();
    }

    public BookResponse findById(Integer bookId) {
        return bookRepository.findById(bookId)
                .map(bookMapper::toBookResponse)
                .orElseThrow(()-> new EntityNotFoundException("No Book Found with ID:: "+bookId));
    }
}
