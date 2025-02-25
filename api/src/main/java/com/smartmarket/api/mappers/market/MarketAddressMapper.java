package com.smartmarket.api.mappers.market;

import com.smartmarket.api.models.dtos.market.MarketAddressDTO;
import com.smartmarket.api.models.entities.market.MarketAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MarketAddressMapper {

    MarketAddressMapper INSTANCE = Mappers.getMapper(MarketAddressMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    MarketAddress toMarketAddress(MarketAddressDTO marketAddressDTO);

    MarketAddressDTO toMarketAddressDTO(MarketAddress marketAddress);

}
