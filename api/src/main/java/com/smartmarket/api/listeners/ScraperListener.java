package com.smartmarket.api.listeners;

import com.smartmarket.api.events.scraper.ScraperOffer;
import com.smartmarket.api.events.scraper.ScraperProduct;
import com.smartmarket.api.events.scraper.ScraperWrapper;
import com.smartmarket.api.mappers.scraper.ScraperMapper;
import com.smartmarket.api.models.entities.market.Market;
import com.smartmarket.api.models.entities.offer.Offer;
import com.smartmarket.api.models.entities.offer.OfferRule;
import com.smartmarket.api.models.entities.product.MarketProduct;
import com.smartmarket.api.models.entities.product.Product;
import com.smartmarket.api.services.impl.market.MarketService;
import com.smartmarket.api.services.impl.offer.OfferRuleService;
import com.smartmarket.api.services.impl.offer.OfferService;
import com.smartmarket.api.services.impl.offer.OfferTypeService;
import com.smartmarket.api.services.impl.product.MarketProductService;
import com.smartmarket.api.services.impl.product.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScraperListener {

    private final MarketService marketService;
    private final ProductService productService;
    private final MarketProductService marketProductService;
    private final OfferService offerService;
    private final OfferTypeService offerTypeService;
    private final OfferRuleService offerRuleService;

    @RabbitListener(queues = "${api.config.rabbitmq.scraper.data.queue}")
    public void receive(ScraperWrapper event) {
        //1. CRIAÇÃO OU ATUALIZAÇÃO DO MERCADO
        Mono<Market> marketMono = Mono.just(ScraperMapper.INSTANCE.toMarket(event.getMarket()))
                .flatMap(marketService::upsert);

        Flux<ScraperProduct> scraperProductFlux = Flux.fromArray(event.getProducts());

        marketMono.flatMapMany(market -> scraperProductFlux.flatMap(scraperProduct -> {

            //2. CRIAÇÃO OU ATUALIZAÇÃO DO PRODUTO
            Mono<Product> productMono = Mono.just(ScraperMapper.INSTANCE.toProduct(scraperProduct))
                    .flatMap(productService::upsert);

            //3. CRIAÇÃO OU ATUALIZAÇÃO DO PRODUTO DO MERCADO
            Mono<MarketProduct> marketProductMono = productMono.map(product -> MarketProduct.builder()
                            .productId(product.getId())
                            .marketId(market.getId())
                            .url(scraperProduct.getUrl())
                            .active(scraperProduct.getActive())
                            .unitMeasure(scraperProduct.getUnitMeasure())
                            .price(scraperProduct.getPrice())
                            .build())
                    .flatMap(marketProductService::upsert);

            //4. CRIAÇÃO OU ATUALIZAÇÃO DAS OFERTAS DO PRODUTO DO MERCADO
            Flux<ScraperOffer> offerFlux = Flux.just(scraperProduct.getOffers());
            return marketProductMono.flatMapMany(marketProduct -> offerFlux
                    .flatMap(scraperOffer -> Mono.just(ScraperMapper.INSTANCE.toOfferType(scraperOffer.getType()))
                            .map(offerType -> {
                                if (Boolean.TRUE.equals(scraperOffer.getType().getMarket()))
                                    offerType.setMarketId(market.getId());
                                return offerType;
                            })
                            .flatMap(offerTypeService::upsert)
                            .flatMap(offerType -> {
                                Offer offer = ScraperMapper.INSTANCE.toOffer(scraperOffer);
                                offer.setOfferTypeId(offerType.getId());
                                offer.setMarketProductId(marketProduct.getId());
                                return offerService.upsert(offer);
                            })
                            .flatMap(offer -> {
                                OfferRule offerRule = ScraperMapper.INSTANCE.toOfferRule(scraperOffer.getRule());
                                offerRule.setOfferId(offer.getId());
                                return offerRuleService.upsert(offerRule);
                            })));
        })).subscribe();
    }

}
