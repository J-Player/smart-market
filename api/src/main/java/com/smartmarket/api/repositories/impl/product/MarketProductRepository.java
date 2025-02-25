package com.smartmarket.api.repositories.impl.product;

import com.smartmarket.api.models.entities.product.MarketProduct;
import com.smartmarket.api.repositories.IRepository;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface MarketProductRepository extends IRepository<MarketProduct> {

    Mono<MarketProduct> findByMarketIdAndProductId(UUID marketId, UUID productId);

    @Transactional
    @Query(value = """
            MERGE INTO market_products AS target
            USING (SELECT :#{#marketProduct.marketId} AS marketId, :#{#marketProduct.productId} AS productId, :#{#marketProduct.url} AS url, :#{#marketProduct.price} AS price, :#{#marketProduct.unitMeasure} AS unitMeasure, :#{#marketProduct.active} AS active) AS source
            ON target.market_id = source.marketId AND target.product_id = source.productId
            WHEN MATCHED THEN
                UPDATE SET url = source.url, price = source.price, unit_measure = source.unitMeasure, active = source.active, updated_at = timezone('UTC', now())
            WHEN NOT MATCHED THEN
                INSERT (market_id, product_id, url, price, unit_measure, active)
                VALUES (source.marketId, source.productId, source.url, source.price, source.unitMeasure, source.active)
            RETURNING target.*;
            """)
    Mono<MarketProduct> upsert(MarketProduct marketProduct);

}