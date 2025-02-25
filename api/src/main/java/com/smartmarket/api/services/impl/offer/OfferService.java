package com.smartmarket.api.services.impl.offer;

import com.smartmarket.api.mappers.offer.OfferMapper;
import com.smartmarket.api.mappers.offer.OfferRuleMapper;
import com.smartmarket.api.models.dtos.offer.OfferResponse;
import com.smartmarket.api.models.dtos.offer.OfferRuleResponse;
import com.smartmarket.api.models.entities.offer.Offer;
import com.smartmarket.api.models.entities.offer.OfferType;
import com.smartmarket.api.repositories.impl.offer.OfferRepository;
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
public class OfferService implements IService<Offer> {

    private final OfferRepository offerRepository;
    private final OfferTypeService offerTypeService;
    private final OfferRuleService offerRuleService;

    @Override
    public Mono<Offer> findById(UUID id) {
        return offerRepository.findById(id);
    }

    public Flux<OfferResponse> findAllByMarketProductId(UUID marketProductId) {
        return offerRepository.findAllByMarketProductId(marketProductId)
                .flatMap(offer -> {
                    OfferResponse offerResponse = OfferMapper.INSTANCE.toOfferResponse(offer);
                    Mono<String> offerTypeMono = offerTypeService.findById(offer.getOfferTypeId())
                            .map(OfferType::getName);
                    Mono<OfferRuleResponse> offerRuleResponseMono = offerRuleService.findByOfferId(offer.getId())
                            .map(OfferRuleMapper.INSTANCE::toOfferRuleResponse);
                    return offerTypeMono
                            .doOnNext(offerResponse::setType)
                            .then(offerRuleResponseMono)
                            .map(offerRuleResponse -> {
                                offerResponse.setOfferRule(offerRuleResponse);
                                return offerResponse;
                            }).switchIfEmpty(Mono.just(offerResponse));
                });
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
