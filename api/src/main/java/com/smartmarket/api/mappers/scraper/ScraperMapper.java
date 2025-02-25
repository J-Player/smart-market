package com.smartmarket.api.mappers.scraper;

import com.smartmarket.api.events.scraper.*;
import com.smartmarket.api.models.entities.market.Market;
import com.smartmarket.api.models.entities.offer.Offer;
import com.smartmarket.api.models.entities.offer.OfferRule;
import com.smartmarket.api.models.entities.offer.OfferType;
import com.smartmarket.api.models.entities.product.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ScraperMapper {

    ScraperMapper INSTANCE = Mappers.getMapper(ScraperMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toProduct(ScraperProduct scraperProduct);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Market toMarket(ScraperMarket scraperMarket);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "offerTypeId", ignore = true)
    @Mapping(target = "marketProductId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Offer toOffer(ScraperOffer scraperOffer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "marketId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    OfferType toOfferType(ScraperOfferType scraperOfferType);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "offerId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    OfferRule toOfferRule(ScraperOfferRule scraperOfferRule);

}
