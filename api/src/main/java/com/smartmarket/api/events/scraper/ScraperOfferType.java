package com.smartmarket.api.events.scraper;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScraperOfferType implements Serializable {
    private Boolean market;
    @NotEmpty
    private String name;
}
