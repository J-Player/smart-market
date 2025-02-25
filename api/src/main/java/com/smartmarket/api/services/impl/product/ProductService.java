package com.smartmarket.api.services.impl.product;

import com.smartmarket.api.models.entities.product.Product;
import com.smartmarket.api.repositories.impl.product.ProductRepository;
import com.smartmarket.api.services.IService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService implements IService<Product> {

    private final ProductRepository productRepository;

    @Override
    public Mono<Product> findById(UUID id) {
        return productRepository.findById(id);
    }

    public Flux<Product> findAllByBrand(String brand) {
        return productRepository.findAllByBrand(brand);
    }

    public Flux<Product> findAllByName(String name) {
        return productRepository.findAllByNameIgnoreCase(name);
    }

    public Flux<Product> findAllByNameContaining(String name) {
        return productRepository.findAllByNameContainingIgnoreCase(name);
    }

    public Flux<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Mono<Product> save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Mono<Void> update(Product product) {
        return findById(product.getId())
                .flatMap(oldProduct -> {
                    product.setCreatedAt(oldProduct.getCreatedAt());
                    product.setUpdatedAt(oldProduct.getUpdatedAt());
                    return save(product);
                })
                .then();
    }

    public Mono<Product> upsert(Product product) {
        return productRepository.upsert(product)
                .doOnSuccess(p -> log.info("Product upserted: {}", p));
    }

    @Override
    public Mono<Void> delete(UUID id) {
        return findById(id)
                .flatMap(productRepository::delete)
                .then();
    }

}
