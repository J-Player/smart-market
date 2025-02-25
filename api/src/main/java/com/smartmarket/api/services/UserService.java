package com.smartmarket.api.services;

import com.smartmarket.api.exceptions.ResourceNotFoundException;
import com.smartmarket.api.models.entities.User;
import com.smartmarket.api.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements ReactiveUserDetailsService, IService<User> {

    private final UserRepository userRepository;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return userRepository.findByUsernameIgnoreCase(username)
                .cast(UserDetails.class);
    }

    @Override
    public Mono<User> findById(UUID id) {
        return userRepository.findById(id)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("User not found")))
                .doOnError(ex -> log.error("Ocorreu um erro ao recuperar o item (id = {}): {}", id, ex.getMessage()));
    }

    public Mono<User> findByName(String username) {
        return userRepository.findByUsernameIgnoreCase(username)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("User not found")));
    }

    // @Override
    public Mono<Page<User>> findAll(Pageable pageable) {
        return userRepository.findAllBy(pageable)
                .collectList()
                .zipWith(userRepository.count())
                .map(p -> new PageImpl<>(p.getT1(), pageable, p.getT2()));
    }

    @Override
    public Mono<User> save(User user) {
        return userRepository.save(user);
    }

    @Override
    public Mono<Void> update(User user) {
        return findById(user.getId())
                .doOnNext(savedUser -> user.setCreatedAt(savedUser.getCreatedAt()))
                .thenReturn(user)
                .flatMap(userRepository::save)
                .then();
    }

    @Override
    public Mono<Void> delete(UUID id) {
        return findById(id)
                .flatMap(userRepository::delete);
    }

    public Mono<Void> deleteAll() {
        return userRepository.deleteAll();
    }

}
