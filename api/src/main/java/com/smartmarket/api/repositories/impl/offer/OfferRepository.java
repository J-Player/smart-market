package com.smartmarket.api.repositories.impl.offer;

import com.smartmarket.api.models.entities.offer.Offer;
import com.smartmarket.api.repositories.IRepository;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Repository
public interface OfferRepository extends IRepository<Offer> {

    @Transactional
    @Query(value = """
            MERGE INTO offers AS target
            USING (SELECT :#{#offer.offerTypeId} AS offerTypeId, :#{#offer.marketProductId} AS marketProductId, :#{#offer.price} AS price, :#{#offer.startDate} AS startDate, :#{#offer.endDate} AS endDate) AS source
            ON target.offer_type_id = source.offerTypeId AND target.market_product_id = source.marketProductId
            WHEN MATCHED THEN
                UPDATE SET offer_type_id = source.offerTypeId, market_product_id = source.marketProductId, price = source.price, start_date = source.startDate, end_date = source.endDate, updated_at = timezone('UTC', now())
            WHEN NOT MATCHED THEN
                INSERT (offer_type_id, market_product_id, price, start_date, end_date)
                VALUES (source.offerTypeId, source.marketProductId, source.price, source.startDate, source.endDate)
            RETURNING target.*;
            """)
    Mono<Offer> upsert(Offer offer);

}
