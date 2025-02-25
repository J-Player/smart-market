package com.smartmarket.api.repositories.impl.offer;

import com.smartmarket.api.models.entities.offer.OfferRule;
import com.smartmarket.api.repositories.IRepository;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Repository
public interface OfferRuleRepository extends IRepository<OfferRule> {

    @Transactional
    @Query(value = """
            MERGE INTO offer_rules AS target
            USING (SELECT :#{#offerRule.offerId} AS offerId, :#{#offerRule.minQuantity} AS minQuantity, :#{#offerRule.maxQuantity} AS maxQuantity, :#{#offerRule.chargedQuantity} AS chargedQuantity, :#{#offerRule.unitMeasure} AS unitMeasure) AS source
            ON target.offer_id = source.offerId
            WHEN MATCHED THEN
                UPDATE SET offer_id = source.offerId, min_quantity = source.minQuantity, max_quantity = source.maxQuantity, charged_quantity = source.chargedQuantity, unit_measure = source.unitMeasure, updated_at = timezone('UTC', now())
            WHEN NOT MATCHED THEN
                INSERT (offer_id, min_quantity, max_quantity, charged_quantity, unit_measure)
                VALUES (source.offerId, source.minQuantity, source.maxQuantity, source.chargedQuantity, source.unitMeasure)
            RETURNING target.*;
            """)
    Mono<OfferRule> upsert(OfferRule offerRule);

}
