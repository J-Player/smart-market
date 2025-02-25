package com.smartmarket.api.events.scraper;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScraperOffer implements Serializable {
    private ScraperOfferType type;
    @NotNull
    private Float price;
    private Instant startDate;
    private Instant endDate;
    private ScraperOfferRule rule;
}
