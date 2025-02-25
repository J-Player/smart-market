package com.smartmarket.api.repositories;

import com.smartmarket.api.models.entities.User;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends IRepository<User> {

    Mono<User> findAllBy(String username);

    Mono<User> findByUsernameIgnoreCase(String username);

}