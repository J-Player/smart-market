package com.smartmarket.api.models.dtos.offer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferRuleResponse {
    private Integer minQuantity;
    private Integer maxQuantity;
    private Integer chargedQuantity;
    private String unitMeasure;
}
