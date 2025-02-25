package com.smartmarket.api.models.entities.offer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@Table("offer_rules")
@NoArgsConstructor
@AllArgsConstructor
public class OfferRule {
    @Id
    private UUID id;
    private UUID offerId;
    private Integer minQuantity;
    private Integer maxQuantity;
    private Integer chargedQuantity;
    private String unitMeasure;
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}
