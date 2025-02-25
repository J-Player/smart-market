package com.smartmarket.api.repositories.impl.market;

import com.smartmarket.api.models.entities.market.Market;
import com.smartmarket.api.repositories.IRepository;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Repository
public interface MarketRepository extends IRepository<Market> {

    Mono<Market> findByName(String name);

    @Transactional
    @Query(value = """
            MERGE INTO markets AS target
            USING (SELECT :#{#market.name} AS name, :#{#market.website} AS website) AS source
            ON target.name = source.name OR target.website = source.website
            WHEN MATCHED THEN
                UPDATE SET name = source.name, website = source.website, updated_at = timezone('UTC', now())
            WHEN NOT MATCHED THEN
                INSERT (name, website)
                VALUES (source.name, source.website)
            RETURNING target.*;
            """)
    Mono<Market> upsert(Market market);
}