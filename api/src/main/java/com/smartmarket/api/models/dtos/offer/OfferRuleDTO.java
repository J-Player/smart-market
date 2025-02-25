package com.smartmarket.api.models.dtos.offer;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferRuleDTO {
    @NotNull
    private UUID offerId;
    private Integer minQuantity;
    private Integer maxQuantity;
    private Integer chargedQuantity;
    private String unitMeasure;
}
