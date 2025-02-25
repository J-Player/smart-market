package com.smartmarket.api.models.dtos.market_product;

import com.smartmarket.api.models.dtos.offer.OfferResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketProductResponse {
    private UUID id;
    private String brand;
    private String name;
    private String market;
    private String url;
    private Float price;
    private String unitMeasure;
    private Boolean active;
    private List<OfferResponse> offers;
    private Instant createdAt;
    private Instant updatedAt;
}
