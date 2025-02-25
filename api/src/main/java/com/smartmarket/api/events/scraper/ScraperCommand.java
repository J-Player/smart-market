package com.smartmarket.api.events.scraper;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class ScraperCommand implements Serializable {
    private String market;
    private String command;

}
