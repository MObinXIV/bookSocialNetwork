package com.mobin.booknetworkapi.book;

import com.mobin.booknetworkapi.common.BaseAuditingEntity;
import com.mobin.booknetworkapi.history.BookTransactionHistory;
import com.mobin.booknetworkapi.user.User;
import com.mobin.booknetworkapi.feedback.Feedback;
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
    // function to calculate & return the rate of the book
    @Transient
    public double getRate(){
        if(feedbacks != null || feedbacks.isEmpty()){
            return 0.0;
        }
        var rate = this.feedbacks.stream()
                .mapToDouble(Feedback::getNote)
                .average()
                .orElse(0.0);
        // round the rate to get and valid number
        double roundedRate = Math.round(rate * 10.0) / 10.0;
        return roundedRate;
    }
}
