package com.smartmarket.api.services.impl.scraper;

import java.util.Map;

import com.smartmarket.api.events.scraper.ScraperCommand;
import com.smartmarket.api.events.scraper.ScraperCommandType;

import lombok.extern.slf4j.Slf4j;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ScraperService {

    private final RabbitTemplate rabbitTemplate;
    private final String exchange;
    private final String routingKey;

    public ScraperService(@Autowired RabbitTemplate rabbitTemplate,
                          @Value("${api.config.rabbitmq.exchange}") String exchange,
                          @Value("${api.config.rabbitmq.scraper.control.routing-key}") String routingKey) {
        this.rabbitTemplate = rabbitTemplate;
        this.exchange = exchange;
        this.routingKey = routingKey;
    }

    public void start(String market) {
        rabbitTemplate.convertAndSend(this.exchange, this.routingKey, ScraperCommand.builder()
                .command(ScraperCommandType.START.getValue())
                .market(market)
                .build(), message -> {
                    int ttl = getMessageTTL("23h");
                    message.getMessageProperties().setExpiration(Integer.toString(ttl));
                    return message;
                });
    }

    @Scheduled(cron = "0 0 0 * * MON-FRI")
    public void startAll() {
        rabbitTemplate.convertAndSend(this.exchange, this.routingKey, ScraperCommand.builder()
                .command(ScraperCommandType.START_ALL.getValue())
                .build());
    }

    private int getMessageTTL(String duration) {
        String regex = "(\\d+)([smhd])";
        String[] groups = duration.replaceAll(regex, "$1 $2").split(" ");
        Integer value = Integer.valueOf(groups[0]);
        char type = groups[1].charAt(0);
        Map<Character, Integer> ttlMap = Map.of(
                's', value * 1000,
                'm', value * 60 * 1000,
                'h', value * 60 * 60 * 1000,
                'd', value * 24 * 60 * 60 * 1000
        );
        return ttlMap.get(type);
    }
}