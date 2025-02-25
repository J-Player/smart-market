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
@Table("offers")
@NoArgsConstructor
@AllArgsConstructor
public class Offer {
    @Id
    private UUID id;
    private UUID offerTypeId;
    private UUID marketProductId;
    private Float price;
    private Instant startDate;
    private Instant endDate;
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}
