package com.mobin.booknetworkapi.history;

import com.mobin.booknetworkapi.book.Book;
import com.mobin.booknetworkapi.common.BaseAuditingEntity;
import com.mobin.booknetworkapi.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class BookTransactionHistory extends BaseAuditingEntity {
    @ManyToOne
    @JoinColumn(name= "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;
    private boolean returned;
    private boolean returnApproved;
}
