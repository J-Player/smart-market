package com.smartmarket.api.models.dtos.product;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketProductDTO {
    @NotNull
    private UUID marketId;
    @NotNull
    private UUID productId;
    private String url;
    private Float price;
    private String unitMeasure;
    private Boolean active;
}
