package com.smartmarket.api.repositories.impl.product;

import com.smartmarket.api.models.entities.product.Product;
import com.smartmarket.api.repositories.IRepository;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Repository
public interface ProductRepository extends IRepository<Product> {

    Mono<Product> findByName(String name);

    @Transactional
    @Query(value = """
            MERGE INTO products AS target
            USING (SELECT :#{#product.brand} AS brand, :#{#product.name} AS name) AS source
            ON target.brand = source.brand AND target.name = source.name
            WHEN MATCHED THEN
                UPDATE SET brand = source.brand, name = source.name, updated_at = timezone('UTC', now())
            WHEN NOT MATCHED THEN
                INSERT (brand, name)
                VALUES (source.brand, source.name)
            RETURNING target.*;
            """)
    Mono<Product> upsert(Product product);

}