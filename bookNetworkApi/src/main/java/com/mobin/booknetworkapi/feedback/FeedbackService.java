package com.mobin.booknetworkapi.feedback;

import com.mobin.booknetworkapi.book.Book;
import com.mobin.booknetworkapi.book.BookRepository;
import com.mobin.booknetworkapi.common.PageResponse;
import com.mobin.booknetworkapi.exception.OperationNotPermittedException;
import com.mobin.booknetworkapi.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private  final BookRepository bookRepository;
    private final FeedbackMapper feedbackMapper;
    private final FeedbackRepository repository;
    public Integer save(FeedbackRequest request, Authentication connectedUser) {
        Book book = bookRepository.findById(request.bookId()).orElseThrow(()-> new EntityNotFoundException("Book not found with ID: "+request.bookId()));
        User user = ((User) connectedUser.getPrincipal());
        if(book.isArchived() || !book.isShareable()){
            throw new OperationNotPermittedException("You cannot rate for  archived or not shareable book");
        }
        if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot rate your own book");
        }
        Feedback feedback = feedbackMapper.toFeedback(request);
        return repository.save(feedback).getId();
    }

    public PageResponse<FeedbackResponse> findAllFeedbacksByBook(Integer bookId, int page, int size, Authentication connectedUser) {
        Pageable pageable = PageRequest.of(page, size);
        User user = ((User) connectedUser.getPrincipal());
        Page<Feedback> feedbacks = repository.findAllByBookId(bookId,pageable);
        List<FeedbackResponse> feedbackResponses = feedbacks.stream()
                .map(f->feedbackMapper.toFeedBackResponse(f,user.getId()))
                .toList();
        return new PageResponse<>(
                feedbackResponses,
                feedbacks.getNumber(),
                feedbacks.getSize(),
                feedbacks.getTotalElements(),
                feedbacks.getTotalPages(),
                feedbacks.isFirst(),
                feedbacks.isLast()
        );
    }
}
