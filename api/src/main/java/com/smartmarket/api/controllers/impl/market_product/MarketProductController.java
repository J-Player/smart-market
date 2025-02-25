package com.smartmarket.api.controllers.impl.market_product;

import com.smartmarket.api.controllers.IController;
import com.smartmarket.api.mappers.product.MarketProductMapper;
import com.smartmarket.api.models.dtos.market_product.MarketProductDTO;
import com.smartmarket.api.models.dtos.market_product.MarketProductResponse;
import com.smartmarket.api.models.entities.product.MarketProduct;
import com.smartmarket.api.services.impl.market_product.MarketProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/markets-products")
public class MarketProductController implements IController<MarketProduct, MarketProductDTO> {

    private final MarketProductService productService;

    @Override
    @GetMapping("/{id}")
    public Mono<MarketProduct> findById(@PathVariable UUID id) {
        return productService.findById(id);
    }

    @GetMapping("/all")
    public Flux<MarketProductResponse> findAll(@RequestParam(required = false) String product, @RequestParam(required = false) String[] markets) {
        return productService.findAllProductByMarkets(product, List.of(markets));
    }

    @Override
    @PostMapping
    public Mono<MarketProduct> save(@RequestBody @Valid MarketProductDTO marketProductDTO) {
        MarketProduct marketProduct = MarketProductMapper.INSTANCE.toMarketProduct(marketProductDTO);
        return productService.save(marketProduct);
    }

    @Override
    @PutMapping("/{id}")
    public Mono<Void> update(@PathVariable UUID id, @RequestBody @Valid MarketProductDTO marketProductDTO) {
        MarketProduct marketProduct = MarketProductMapper.INSTANCE.toMarketProduct(marketProductDTO);
        marketProduct.setId(id);
        return productService.update(marketProduct);
    }

    @Override
    @DeleteMapping("/{id}")
    public Mono<Void> delete(@PathVariable UUID id) {
        return productService.delete(id);
    }

}
