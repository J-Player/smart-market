package com.smartmarket.api.mappers.offer;

import com.smartmarket.api.models.dtos.offer.OfferDTO;
import com.smartmarket.api.models.entities.offer.Offer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface OfferMapper {

    OfferMapper INSTANCE = Mappers.getMapper(OfferMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Offer toOffer(OfferDTO offerDTO);

    OfferDTO toOfferDTO(Offer offer);

}
