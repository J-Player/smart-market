package com.smartmarket.api.mappers.market;

import com.smartmarket.api.models.dtos.market.MarketDTO;
import com.smartmarket.api.models.entities.market.Market;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MarketMapper {

    MarketMapper INSTANCE = Mappers.getMapper(MarketMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Market toMarket(MarketDTO marketDTO);

    MarketDTO toMarketDTO(Market market);

}
