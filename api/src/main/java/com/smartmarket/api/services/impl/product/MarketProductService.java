package com.smartmarket.api.services.impl.product;

import com.smartmarket.api.models.entities.product.MarketProduct;
import com.smartmarket.api.repositories.impl.product.MarketProductRepository;
import com.smartmarket.api.services.IService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketProductService implements IService<MarketProduct> {

    private final MarketProductRepository marketProductRepository;

    @Override
    public Mono<MarketProduct> findById(UUID id) {
        return marketProductRepository.findById(id);
    }

    public Mono<MarketProduct> findByMarketIdAndProductId(UUID marketId, UUID productId) {
        return marketProductRepository.findByMarketIdAndProductId(marketId, productId);
    }

    @Override
    public Mono<MarketProduct> save(MarketProduct marketProduct) {
        return marketProductRepository.save(marketProduct);
    }

    @Override
    public Mono<Void> update(MarketProduct marketProduct) {
        return findById(marketProduct.getId())
                .flatMap(oldMarketProduct -> {
                    marketProduct.setCreatedAt(oldMarketProduct.getCreatedAt());
                    marketProduct.setUpdatedAt(oldMarketProduct.getUpdatedAt());
                    return save(marketProduct);
                })
                .then();
    }

    @Override
    public Mono<Void> delete(UUID id) {
        return findById(id)
                .flatMap(marketProductRepository::delete)
                .then();
    }

    public Mono<MarketProduct> upsert(MarketProduct marketProduct) {
        return marketProductRepository.upsert(marketProduct)
                .doOnSuccess(mp -> log.info("MarketProduct upserted: {}", mp));
    }
}
