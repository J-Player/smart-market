package com.smartmarket.api.events.scraper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScraperMarket implements Serializable {
    private String name;
    private String website;
}