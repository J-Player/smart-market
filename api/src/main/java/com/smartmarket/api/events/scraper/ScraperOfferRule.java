package com.smartmarket.api.events.scraper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScraperOfferRule implements Serializable {
    private Integer minQuantity;
    private Integer maxQuantity;
    private Integer chargedQuantity;
    private String unitMeasure;
}
