package com.smartmarket.api.events.scraper;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScraperWrapper implements Serializable {
    @NotNull
    private ScraperMarket market;
    @NotNull
    private ScraperProduct[] products;
}
