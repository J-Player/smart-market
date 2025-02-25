package com.smartmarket.api.services.impl.offer;

import com.smartmarket.api.models.entities.offer.OfferType;
import com.smartmarket.api.repositories.impl.offer.OfferTypeRepository;
import com.smartmarket.api.services.IService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OfferTypeService implements IService<OfferType> {

    private final OfferTypeRepository offerRepository;

    @Override
    public Mono<OfferType> findById(UUID id) {
        return offerRepository.findById(id);
    }

    @Override
    public Mono<OfferType> save(OfferType offerType) {
        return offerRepository.save(offerType);
    }

    @Override
    public Mono<Void> update(OfferType offerType) {
        return findById(offerType.getId())
                .flatMap(oldOfferType -> {
                    offerType.setCreatedAt(oldOfferType.getCreatedAt());
                    offerType.setUpdatedAt(oldOfferType.getUpdatedAt());
                    return save(offerType);
                })
                .then();
    }

    public Mono<OfferType> upsert(OfferType offerType) {
        return offerRepository.upsert(offerType)
                .doOnSuccess(o -> log.info("OfferType upserted: {}", o));
    }

    @Override
    public Mono<Void> delete(UUID id) {
        return findById(id)
                .flatMap(offerRepository::delete)
                .then();
    }

}
