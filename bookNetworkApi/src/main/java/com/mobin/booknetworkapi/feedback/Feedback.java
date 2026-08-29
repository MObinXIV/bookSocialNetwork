package com.mobin.booknetworkapi.feedback;

import com.mobin.booknetworkapi.book.Book;
import com.mobin.booknetworkapi.common.BaseAuditingEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Feedback  extends BaseAuditingEntity {
    private Double note; // stars -> 1-5
    private String comment;

    @ManyToOne
    @JoinColumn(name="book_id")
    private Book book;
}
