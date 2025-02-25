package com.smartmarket.api.mappers.product;

import com.smartmarket.api.models.dtos.market_product.MarketProductDTO;
import com.smartmarket.api.models.dtos.market_product.MarketProductResponse;
import com.smartmarket.api.models.entities.product.MarketProduct;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MarketProductMapper {

    MarketProductMapper INSTANCE = Mappers.getMapper(MarketProductMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    MarketProduct toMarketProduct(MarketProductDTO marketProductDTO);

    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "market", ignore = true)
    @Mapping(target = "offers", ignore = true)
    MarketProductResponse toMarketProductResponse(MarketProduct marketProduct);

}
