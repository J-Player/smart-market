package com.smartmarket.api.controllers.impl.market;

import com.smartmarket.api.controllers.IController;
import com.smartmarket.api.mappers.market.MarketAddressMapper;
import com.smartmarket.api.models.dtos.market.MarketAddressDTO;
import com.smartmarket.api.models.entities.market.MarketAddress;
import com.smartmarket.api.services.impl.market.MarketAddressService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/markets/addresses")
public class MarketAddressController implements IController<MarketAddress, MarketAddressDTO> {

    private final MarketAddressService marketAddressService;

    @Override
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get Market Address by ID")
    public Mono<MarketAddress> findById(@PathVariable UUID id) {
        return marketAddressService.findById(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all Market Addresses")
    public Flux<MarketAddress> findAllByMarketId(@RequestParam UUID marketId) {
        return marketAddressService.findAllByMarketId(marketId);
    }

    @Override
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new Market Address")
    public Mono<MarketAddress> save(@RequestBody @Valid MarketAddressDTO marketAddressDTO) {
        MarketAddress marketAddress = MarketAddressMapper.INSTANCE.toMarketAddress(marketAddressDTO);
        return marketAddressService.save(marketAddress);
    }

    @Override
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Update an existing Market Address")
    public Mono<Void> update(@PathVariable UUID id, @RequestBody @Valid MarketAddressDTO marketAddressDTO) {
        MarketAddress marketAddress = MarketAddressMapper.INSTANCE.toMarketAddress(marketAddressDTO);
        marketAddress.setId(id);
        return marketAddressService.update(marketAddress);
    }

    @Override
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a Market Address by ID")
    public Mono<Void> delete(@PathVariable UUID id) {
        return marketAddressService.delete(id);
    }

}
