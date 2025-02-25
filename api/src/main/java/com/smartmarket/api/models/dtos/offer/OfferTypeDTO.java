package com.smartmarket.api.models.dtos.offer;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferTypeDTO {
    private UUID marketId;
    @NotEmpty
    private String name;
}
