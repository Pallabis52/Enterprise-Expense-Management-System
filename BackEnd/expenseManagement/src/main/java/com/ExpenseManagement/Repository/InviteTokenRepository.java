package com.expensemanagement.Repository;

import com.expensemanagement.Entities.InviteToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InviteTokenRepository extends JpaRepository<InviteToken, Long> {
    Optional<InviteToken> findByToken(String token);

    Optional<InviteToken> findByEmailAndStatus(String email, InviteToken.InviteStatus status);
}
