package com.smartmarket.api.models.dtos.market;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketDTO {
    @NotEmpty
    private String name;
    @NotEmpty
    private String website;
}
