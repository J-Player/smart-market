package com.smartmarket.api.controllers.impl.market;

import com.smartmarket.api.controllers.IController;
import com.smartmarket.api.mappers.market.MarketMapper;
import com.smartmarket.api.models.dtos.market.MarketDTO;
import com.smartmarket.api.models.entities.market.Market;
import com.smartmarket.api.services.impl.market.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/markets")
public class MarketController implements IController<Market, MarketDTO> {

    private final MarketService marketService;

    @Override
    @GetMapping("/{id}")
    public Mono<Market> findById(@PathVariable UUID id) {
        return marketService.findById(id);
    }

    @Override
    @PostMapping
    public Mono<Market> save(@RequestBody MarketDTO marketDTO) {
        Market market = MarketMapper.INSTANCE.toMarket(marketDTO);
        return marketService.save(market);
    }

    @Override
    @PutMapping("/{id}")
    public Mono<Void> update(@PathVariable UUID id, @RequestBody MarketDTO marketDTO) {
        Market market = MarketMapper.INSTANCE.toMarket(marketDTO);
        market.setId(id);
        return marketService.update(market);
    }

    @Override
    @DeleteMapping("/{id}")
    public Mono<Void> delete(@PathVariable UUID id) {
        return marketService.delete(id);
    }

}
