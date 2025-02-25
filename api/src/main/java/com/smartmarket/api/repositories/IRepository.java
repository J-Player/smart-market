package com.smartmarket.api.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@NoRepositoryBean
public interface IRepository<T> extends ReactiveCrudRepository<T, UUID>,
        ReactiveSortingRepository<T, UUID> {

    Flux<T> findAllBy(Pageable pageable);

}