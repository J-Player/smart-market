package com.smartmarket.api.models.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UnitMeasure {
    KG("kg"),
    L("l"),
    UN("un");

    private final String measure;
}
