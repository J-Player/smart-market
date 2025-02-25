package com.smartmarket.api.controllers.impl.offer;

import com.smartmarket.api.controllers.IController;
import com.smartmarket.api.mappers.offer.OfferRuleMapper;
import com.smartmarket.api.models.dtos.offer.OfferRuleDTO;
import com.smartmarket.api.models.entities.offer.OfferRule;
import com.smartmarket.api.services.impl.offer.OfferRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/offers/rules")
public class OfferRuleController implements IController<OfferRule, OfferRuleDTO> {

    private final OfferRuleService offerRuleService;

    @Override
    @GetMapping("/{id}")
    public Mono<OfferRule> findById(@PathVariable UUID id) {
        return offerRuleService.findById(id);
    }

    @Override
    @PostMapping
    public Mono<OfferRule> save(@RequestBody OfferRuleDTO offerRuleDTO) {
        OfferRule offerRule = OfferRuleMapper.INSTANCE.toOfferRule(offerRuleDTO);
        return offerRuleService.save(offerRule);
    }

    @Override
    @PutMapping("/{id}")
    public Mono<Void> update(@PathVariable UUID id, @RequestBody OfferRuleDTO offerRuleDTO) {
        OfferRule offerRule = OfferRuleMapper.INSTANCE.toOfferRule(offerRuleDTO);
        offerRule.setId(id);
        return offerRuleService.update(offerRule);
    }

    @Override
    @DeleteMapping("/{id}")
    public Mono<Void> delete(@PathVariable UUID id) {
        return offerRuleService.delete(id);
    }

}
