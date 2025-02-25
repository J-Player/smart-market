package com.smartmarket.api.controllers.impl.market;

import com.smartmarket.api.controllers.IController;
import com.smartmarket.api.mappers.market.MarketAddressMapper;
import com.smartmarket.api.models.dtos.market.MarketAddressDTO;
import com.smartmarket.api.models.entities.market.MarketAddress;
import com.smartmarket.api.services.impl.market.MarketAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/markets/addresses")
public class MarketAddressController implements IController<MarketAddress, MarketAddressDTO> {

    private final MarketAddressService marketAddressService;

    @Override
    @GetMapping("/{id}")
    public Mono<MarketAddress> findById(@PathVariable UUID id) {
        return marketAddressService.findById(id);
    }

    @Override
    @PostMapping
    public Mono<MarketAddress> save(@RequestBody MarketAddressDTO marketAddressDTO) {
        MarketAddress marketAddress = MarketAddressMapper.INSTANCE.toMarketAddress(marketAddressDTO);
        return marketAddressService.save(marketAddress);
    }

    @Override
    @PutMapping("/{id}")
    public Mono<Void> update(@PathVariable UUID id, @RequestBody MarketAddressDTO marketAddressDTO) {
        MarketAddress marketAddress = MarketAddressMapper.INSTANCE.toMarketAddress(marketAddressDTO);
        marketAddress.setId(id);
        return marketAddressService.update(marketAddress);
    }

    @Override
    @DeleteMapping("/{id}")
    public Mono<Void> delete(@PathVariable UUID id) {
        return marketAddressService.delete(id);
    }

}
