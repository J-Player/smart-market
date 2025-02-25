package com.smartmarket.api.events.scraper;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ScraperCommandType {
    START("start"),
    START_ALL("start-all");

    private final String value;
}
