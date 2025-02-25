package com.smartmarket.api.controllers.impl.scraper;

import com.smartmarket.api.services.impl.scraper.ScraperService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/scrapers")
public class ScraperController {

    private final ScraperService scraperService;

    @PostMapping("/start")
    public void start(@RequestParam String market) {
        scraperService.start(market);
    }

    @PostMapping("/start/all")
    public void startAll() {
        scraperService.startAll();
    }

}