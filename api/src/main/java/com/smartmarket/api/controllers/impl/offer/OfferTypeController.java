package com.smartmarket.api.controllers.impl.offer;

import com.smartmarket.api.controllers.IController;
import com.smartmarket.api.mappers.offer.OfferTypeMapper;
import com.smartmarket.api.models.dtos.offer.OfferTypeDTO;
import com.smartmarket.api.models.entities.offer.OfferType;
import com.smartmarket.api.services.impl.offer.OfferTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/offers/types")
public class OfferTypeController implements IController<OfferType, OfferTypeDTO> {

    private final OfferTypeService offerTypeService;

    @Override
    @GetMapping("/{id}")
    public Mono<OfferType> findById(@PathVariable UUID id) {
        return offerTypeService.findById(id);
    }

    @Override
    @PostMapping
    public Mono<OfferType> save(@RequestBody OfferTypeDTO offerTypeDTO) {
        OfferType offerType = OfferTypeMapper.INSTANCE.toOfferType(offerTypeDTO);
        return offerTypeService.save(offerType);
    }

    @Override
    @PutMapping("/{id}")
    public Mono<Void> update(@PathVariable UUID id, @RequestBody OfferTypeDTO offerTypeDTO) {
        OfferType offerType = OfferTypeMapper.INSTANCE.toOfferType(offerTypeDTO);
        offerType.setId(id);
        return offerTypeService.update(offerType);
    }

    @Override
    @DeleteMapping("/{id}")
    public Mono<Void> delete(@PathVariable UUID id) {
        return offerTypeService.delete(id);
    }

}
