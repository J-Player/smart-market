package com.smartmarket.api.services.impl.offer;

import com.smartmarket.api.models.entities.offer.Offer;
import com.smartmarket.api.repositories.impl.offer.OfferRepository;
import com.smartmarket.api.services.IService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OfferService implements IService<Offer> {

    private final OfferRepository offerRepository;

    @Override
    public Mono<Offer> findById(UUID id) {
        return offerRepository.findById(id);
    }

    @Override
    public Mono<Offer> save(Offer offer) {
        return offerRepository.save(offer);
    }

    @Override
    public Mono<Void> update(Offer offer) {
        return findById(offer.getId())
                .flatMap(oldOffer -> {
                    offer.setCreatedAt(oldOffer.getCreatedAt());
                    offer.setUpdatedAt(oldOffer.getUpdatedAt());
                    return save(offer);
                })
                .then();
    }

    public Mono<Offer> upsert(Offer offer) {
        return offerRepository.upsert(offer)
                .doOnSuccess(o -> log.info("Offer upserted: {}", o));
    }

    @Override
    public Mono<Void> delete(UUID id) {
        return findById(id)
                .flatMap(offerRepository::delete)
                .then();
    }
}
