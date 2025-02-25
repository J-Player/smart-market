package com.smartmarket.api.controllers.impl.offer;

import com.smartmarket.api.controllers.IController;
import com.smartmarket.api.mappers.offer.OfferMapper;
import com.smartmarket.api.models.dtos.offer.OfferDTO;
import com.smartmarket.api.models.dtos.offer.OfferResponse;
import com.smartmarket.api.models.entities.offer.Offer;
import com.smartmarket.api.services.impl.offer.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/offers")
public class OfferController implements IController<Offer, OfferDTO> {

    private final OfferService offerService;

    @Override
    @GetMapping("/{id}")
    public Mono<Offer> findById(@PathVariable UUID id) {
        return offerService.findById(id);
    }

    @GetMapping("/all/{id}")
    public Flux<OfferResponse> findAll(@PathVariable UUID id) {
        return offerService.findAllByMarketProductId(id);
    }

    @Override
    @PostMapping
    public Mono<Offer> save(@RequestBody @Valid OfferDTO offerDTO) {
        Offer offer = OfferMapper.INSTANCE.toOffer(offerDTO);
        return offerService.save(offer);
    }

    @Override
    @PutMapping("/{id}")
    public Mono<Void> update(@PathVariable UUID id, @RequestBody @Valid OfferDTO offerDTO) {
        Offer offer = OfferMapper.INSTANCE.toOffer(offerDTO);
        offer.setId(id);
        return offerService.update(offer);
    }

    @Override
    @DeleteMapping("/{id}")
    public Mono<Void> delete(@PathVariable UUID id) {
        return offerService.delete(id);
    }

}
