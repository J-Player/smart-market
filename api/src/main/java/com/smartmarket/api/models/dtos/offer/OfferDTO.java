package com.smartmarket.api.models.dtos.offer;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferDTO {
    private UUID offerTypeId;
    @NotNull
    private UUID marketProductId;
    private Float price;
    private Instant startDate;
    private Instant endDate;
}
