package com.smartmarket.api.services.impl.market;

import com.smartmarket.api.models.entities.market.MarketAddress;
import com.smartmarket.api.repositories.impl.market.MarketAddressRepository;
import com.smartmarket.api.services.IService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MarketAddressService implements IService<MarketAddress> {

    private final MarketAddressRepository marketAddressRepository;

    @Override
    public Mono<MarketAddress> findById(UUID id) {
        return marketAddressRepository.findById(id);
    }

    @Override
    public Mono<MarketAddress> save(MarketAddress marketAddress) {
        return marketAddressRepository.save(marketAddress);
    }

    @Override
    public Mono<Void> update(MarketAddress marketAddress) {
        return findById(marketAddress.getId())
                .flatMap(oldMarketAddress -> {
                    marketAddress.setCreatedAt(oldMarketAddress.getCreatedAt());
                    marketAddress.setUpdatedAt(oldMarketAddress.getUpdatedAt());
                    return save(marketAddress);
                })
                .then();
    }

    @Override
    public Mono<Void> delete(UUID id) {
        return findById(id)
                .flatMap(marketAddressRepository::delete)
                .then();
    }

}
