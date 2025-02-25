package com.smartmarket.api.mappers.offer;

import com.smartmarket.api.models.dtos.offer.OfferRuleDTO;
import com.smartmarket.api.models.entities.offer.OfferRule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface OfferRuleMapper {

    OfferRuleMapper INSTANCE = Mappers.getMapper(OfferRuleMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    OfferRule toOfferRule(OfferRuleDTO offerRuleDTO);

    OfferRuleDTO toOfferRuleDTO(OfferRule offerRule);

}
