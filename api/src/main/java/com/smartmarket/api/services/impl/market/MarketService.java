package com.smartmarket.api.services.impl.market;

import com.smartmarket.api.models.entities.market.Market;
import com.smartmarket.api.repositories.impl.market.MarketRepository;
import com.smartmarket.api.services.IService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketService implements IService<Market> {

    private final MarketRepository marketRepository;

    @Override
    public Mono<Market> findById(UUID id) {
        return marketRepository.findById(id);
    }

    @Override
    public Mono<Market> save(Market market) {
        return marketRepository.save(market);
    }

    @Override
    public Mono<Void> update(Market market) {
        return findById(market.getId())
                .flatMap(oldMarket -> {
                    market.setCreatedAt(oldMarket.getCreatedAt());
                    market.setUpdatedAt(oldMarket.getUpdatedAt());
                    return save(market);
                })
                .then();
    }

    public Mono<Market> upsert(Market market) {
        return marketRepository.upsert(market)
                .doOnSuccess(m -> log.info("Market upserted: {}", m));
    }

    @Override
    public Mono<Void> delete(UUID id) {
        return findById(id)
                .flatMap(marketRepository::delete)
                .doOnSuccess(m -> log.info("Market deleted: {}", m))
                .then();
    }

}
