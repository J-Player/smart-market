package com.smartmarket.api.models.dtos.market;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketAddressDTO {
    @NotNull
    private UUID marketId;
    @NotNull
    private UUID addressId;
}
