package com.smartmarket.api.services;

import reactor.core.publisher.Mono;

import java.util.UUID;

public interface IService<T> {
    Mono<T> findById(UUID id);

    Mono<T> save(T t);

    Mono<Void> update(T t);

    Mono<Void> delete(UUID id);
}
