package com.smartmarket.api.events.scraper;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScraperProduct implements Serializable {
    private String brand;
    @NotEmpty
    private String name;
    private String url;
    private Float price;
    private String unitMeasure;
    private Boolean active;
    private ScraperOffer[] offers;
}
