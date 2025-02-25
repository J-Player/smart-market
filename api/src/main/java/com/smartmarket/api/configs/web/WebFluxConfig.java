package com.smartmarket.api.configs.web;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.smartmarket.api.configs.web.deserializers.GrantedAuthorityDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.ReactivePageableHandlerMethodArgumentResolver;
import org.springframework.data.web.ReactiveSortHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerCodecConfigurer;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.http.codec.json.Jackson2JsonEncoder;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.lang.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.result.method.annotation.ArgumentResolverConfigurer;

import java.time.Instant;
import java.util.TimeZone;

@Configuration
@EnableWebFlux
public class WebFluxConfig implements WebFluxConfigurer {

    public static final String PAGE_INITIAL = "1";

    public static final String PAGE_SIZE_DEFAULT = "20";
    public static final String MAX_PAGE_SIZE = "100";

    public static final String PAGE_PARAM_NAME = "page";
    public static final String SIZE_PARAM_NAME = "size";
    public static final String SORT_PARAM_NAME = "sort";

    private Sort defaultSort() {
        return Sort.by(Sort.Direction.ASC, "id");
    }

    private Pageable defaultPageRequest() {
        return PageRequest.ofSize(Integer.parseInt(PAGE_SIZE_DEFAULT));
    }

    @Override
    public void configureArgumentResolvers(@NonNull ArgumentResolverConfigurer configurer) {
        ReactiveSortHandlerMethodArgumentResolver sortHandlerMethodArgumentResolver = new ReactiveSortHandlerMethodArgumentResolver();
        sortHandlerMethodArgumentResolver.setSortParameter(SORT_PARAM_NAME);
        sortHandlerMethodArgumentResolver.setFallbackSort(defaultSort());
        ReactivePageableHandlerMethodArgumentResolver pageableHandlerMethodArgumentResolver = new ReactivePageableHandlerMethodArgumentResolver(
                sortHandlerMethodArgumentResolver);
        pageableHandlerMethodArgumentResolver.setPageParameterName(PAGE_PARAM_NAME);
        pageableHandlerMethodArgumentResolver.setSizeParameterName(SIZE_PARAM_NAME);
        pageableHandlerMethodArgumentResolver.setMaxPageSize(Integer.parseInt(MAX_PAGE_SIZE));
        pageableHandlerMethodArgumentResolver.setFallbackPageable(defaultPageRequest());
        pageableHandlerMethodArgumentResolver.setOneIndexedParameters(true);
        configurer.addCustomResolver(pageableHandlerMethodArgumentResolver);
    }

    @Override
    public void configureHttpMessageCodecs(ServerCodecConfigurer configurer) {
        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json()
                .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .modules(grantedAuthorityModule())
                .build();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configOverride(Instant.class)
                .setFormat(JsonFormat.Value.forPattern("yyyy-MM-dd'T'HH:mm:ss'Z'")
                        .withTimeZone(TimeZone.getTimeZone("UTC")));
        Jackson2JsonEncoder encoder = new Jackson2JsonEncoder(objectMapper, MediaType.APPLICATION_JSON);
        Jackson2JsonDecoder decoder = new Jackson2JsonDecoder(objectMapper, MediaType.APPLICATION_JSON);

        configurer.defaultCodecs().jackson2JsonEncoder(encoder);
        configurer.defaultCodecs().jackson2JsonDecoder(decoder);
    }

    @Bean
    Module grantedAuthorityModule() {
        SimpleModule module = new SimpleModule();
        module.addDeserializer(GrantedAuthority.class, new GrantedAuthorityDeserializer());
        return module;
    }

}
