package com.mobin.booknetworkapi.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookTransactionHistoryRepository extends JpaRepository<BookTransactionHistory, Integer> {
    @Query("""
           SELECT history
           FROM BookTransactionHistory history
           WHERE history.user.id= :userId
           """)
    Page<BookTransactionHistory> findAllBorrowedBooks(Pageable pageable, @Param("userId") Integer userId);
    @Query("""
           SELECT history
           FROM BookTransactionHistory history
           WHERE history.book.owner.id= :userId
           """)
    Page<BookTransactionHistory> findAllReturnedBooks(Pageable pageable, @Param("userId") Integer userId);
    @Query("""
            SELECT (COUNT(*)>0) AS isBorrowed
            FROM BookTransactionHistory hist
            WHERE hist.book.id= :bookId
            AND hist.returnApproved= false
            """)
    boolean isCurrentlyBorrowed(@Param("bookId") Integer bookId);
    @Query("""
            SELECT transaction
            FROM BookTransactionHistory transaction
            WHERE transaction.user.id= :userId
            AND transaction.book.id= :bookId
            AND transaction.returned= false
            AND transaction.returnApproved= false
            """)
    Optional <BookTransactionHistory> findByBookIdAndUserId(
            @Param("bookId") Integer bookId,
            @Param("userId") Integer userId
    );
    @Query("""
            SELECT transaction
            FROM BookTransactionHistory transaction
            WHERE transaction.book.owner.id= :userId
            AND transaction.book.id= :bookId
            AND transaction.returned= true
            AND transaction.returnApproved= false
            """)
    List<BookTransactionHistory> findAllByBookIdAndOwnerId(
            @Param("bookId") Integer bookId,
            @Param("userId") Integer userId
    );
}
