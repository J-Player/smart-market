package com.smartmarket.api.services.impl.market_product;

import com.smartmarket.api.mappers.product.MarketProductMapper;
import com.smartmarket.api.models.dtos.market_product.MarketProductResponse;
import com.smartmarket.api.models.entities.market.Market;
import com.smartmarket.api.models.entities.product.MarketProduct;
import com.smartmarket.api.models.entities.product.Product;
import com.smartmarket.api.repositories.impl.product.MarketProductRepository;
import com.smartmarket.api.services.IService;
import com.smartmarket.api.services.impl.market.MarketService;
import com.smartmarket.api.services.impl.offer.OfferService;
import com.smartmarket.api.services.impl.product.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketProductService implements IService<MarketProduct> {

    private final MarketProductRepository marketProductRepository;
    private final MarketService marketService;
    private final ProductService productService;
    private final OfferService offerService;

    @Override
    public Mono<MarketProduct> findById(UUID id) {
        return marketProductRepository.findById(id);
    }

    public Flux<MarketProductResponse> findAllProductByMarkets(String product, List<String> markets) {
        Mono<List<Product>> productMono = productService.findAllByNameContaining(product).collectList();
        Mono<List<Market>> marketMono = Flux.fromIterable(markets)
                .flatMap(marketService::findByNameIgnoreCase)
                .collectList();
        return productMono.zipWith(marketMono).flatMapMany(t -> {
            List<UUID> productIds = t.getT1().stream().map(Product::getId).toList();
            List<UUID> marketIds = t.getT2().stream().map(Market::getId).toList();
            return marketProductRepository.findAllByProductIdInAndMarketIdIn(productIds, marketIds)
                    .map(marketProduct -> {
                        MarketProductResponse marketProductResponse = MarketProductMapper.INSTANCE.toMarketProductResponse(marketProduct);
                        Optional<String> productOptional = t.getT1()
                                .stream()
                                .filter(market -> market.getId() == marketProduct.getProductId())
                                .map(Product::getName)
                                .findFirst();
                        Optional<String> marketOptional = t.getT2()
                                .stream()
                                .filter(market -> market.getId() == marketProduct.getMarketId())
                                .map(Market::getName)
                                .findFirst();
                        productOptional.ifPresent(marketProductResponse::setName);
                        marketOptional.ifPresent(marketProductResponse::setMarket);
                        return marketProductResponse;
                    })
                    .doOnNext(marketProduct ->
                            offerService.findAllByMarketProductId(marketProduct.getId())
                                    .collectList()
                                    .doOnNext(marketProduct::setOffers));
        });
    }

    @Override
    public Mono<MarketProduct> save(MarketProduct marketProduct) {
        return marketProductRepository.save(marketProduct);
    }

    @Override
    public Mono<Void> update(MarketProduct marketProduct) {
        return findById(marketProduct.getId())
                .flatMap(oldMarketProduct -> {
                    marketProduct.setCreatedAt(oldMarketProduct.getCreatedAt());
                    marketProduct.setUpdatedAt(oldMarketProduct.getUpdatedAt());
                    return save(marketProduct);
                })
                .then();
    }

    @Override
    public Mono<Void> delete(UUID id) {
        return findById(id)
                .flatMap(marketProductRepository::delete)
                .then();
    }

    public Mono<MarketProduct> upsert(MarketProduct marketProduct) {
        return marketProductRepository.upsert(marketProduct)
                .doOnSuccess(mp -> log.info("MarketProduct upserted: {}", mp));
    }

}
