package com.smartmarket.api.repositories.impl.offer;

import com.smartmarket.api.models.entities.offer.OfferType;
import com.smartmarket.api.repositories.IRepository;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Repository
public interface OfferTypeRepository extends IRepository<OfferType> {

    @Transactional
    @Query(value = """
            MERGE INTO offer_types AS target
            USING (SELECT :#{#offerType.marketId} AS marketId, :#{#offerType.name} AS name) AS source
            ON target.market_id = source.marketId AND target.name = source.name
            WHEN MATCHED THEN
                UPDATE SET market_id = source.marketId, name = source.name, updated_at = timezone('UTC', now())
            WHEN NOT MATCHED THEN
                INSERT (market_id, name)
                VALUES (source.marketId, source.name)
            RETURNING target.*;
            """)
    Mono<OfferType> upsert(OfferType offerType);
}
