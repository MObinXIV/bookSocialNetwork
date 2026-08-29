package com.mobin.booknetworkapi.book;

import com.mobin.booknetworkapi.user.User;
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
}
