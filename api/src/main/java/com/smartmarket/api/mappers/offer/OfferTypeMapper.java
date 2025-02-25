package com.smartmarket.api.mappers.offer;

import com.smartmarket.api.models.dtos.offer.OfferTypeDTO;
import com.smartmarket.api.models.entities.offer.OfferType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface OfferTypeMapper {

    OfferTypeMapper INSTANCE = Mappers.getMapper(OfferTypeMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    OfferType toOfferType(OfferTypeDTO offerTypeDTO);

    OfferTypeDTO toOfferTypeDTO(OfferType offerType);

}
