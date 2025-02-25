package com.smartmarket.api.repositories.impl.market;

import com.smartmarket.api.models.entities.market.MarketAddress;
import com.smartmarket.api.repositories.IRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface MarketAddressRepository extends IRepository<MarketAddress> {

    Flux<MarketAddress> findAllByMarketId(UUID marketId);
}