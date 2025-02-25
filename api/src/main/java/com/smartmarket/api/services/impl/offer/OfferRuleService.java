package com.smartmarket.api.services.impl.offer;

import com.smartmarket.api.models.entities.offer.OfferRule;
import com.smartmarket.api.repositories.impl.offer.OfferRuleRepository;
import com.smartmarket.api.services.IService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OfferRuleService implements IService<OfferRule> {

    private final OfferRuleRepository offerRepository;

    @Override
    public Mono<OfferRule> findById(UUID id) {
        return offerRepository.findById(id);
    }

    @Override
    public Mono<OfferRule> save(OfferRule offerRule) {
        return offerRepository.save(offerRule);
    }

    @Override
    public Mono<Void> update(OfferRule offerRule) {
        return findById(offerRule.getId())
                .flatMap(oldOfferRule -> {
                    offerRule.setCreatedAt(oldOfferRule.getCreatedAt());
                    offerRule.setUpdatedAt(oldOfferRule.getUpdatedAt());
                    return save(offerRule);
                })
                .then();
    }

    public Mono<OfferRule> upsert(OfferRule offerRule) {
        return offerRepository.upsert(offerRule)
                .doOnSuccess(o -> log.info("OfferRule upserted: {}", o));
    }

    @Override
    public Mono<Void> delete(UUID id) {
        return findById(id)
                .flatMap(offerRepository::delete)
                .then();
    }

}
