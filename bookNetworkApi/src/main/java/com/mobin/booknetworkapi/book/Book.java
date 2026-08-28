package com.mobin.booknetworkapi.book;

import com.mobin.booknetworkapi.common.BaseAuditingEntity;
import com.mobin.booknetworkapi.history.BookTransactionHistory;
import com.mobin.booknetworkapi.user.User;
import feedback.Feedback;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Book extends BaseAuditingEntity {
    private String title;
    private String authorName;
    private String isbn;
    private String synopsis;
    private String bookCover;
    private boolean archived;
    private boolean shareable;
    @ManyToOne
    @JoinColumn(name ="owner_id")
    private User owner;

    @OneToMany(mappedBy = "book")
    private List<Feedback> feedbacks;

    @OneToMany(mappedBy = "book")
    private List<BookTransactionHistory>histories;
}
