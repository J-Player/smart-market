package com.smartmarket.api.controllers.impl.product;

import com.smartmarket.api.controllers.IController;
import com.smartmarket.api.mappers.product.ProductMapper;
import com.smartmarket.api.models.dtos.product.ProductDTO;
import com.smartmarket.api.models.entities.product.Product;
import com.smartmarket.api.services.impl.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController implements IController<Product, ProductDTO> {

    private final ProductService productService;

    @Override
    @GetMapping("/{id}")
    public Mono<Product> findById(@PathVariable UUID id) {
        return productService.findById(id);
    }

    @Override
    @PostMapping
    public Mono<Product> save(@RequestBody ProductDTO productDTO) {
        Product product = ProductMapper.INSTANCE.toProduct(productDTO);
        return productService.save(product);
    }

    @Override
    @PutMapping("/{id}")
    public Mono<Void> update(@PathVariable UUID id, @RequestBody ProductDTO productDTO) {
        Product product = ProductMapper.INSTANCE.toProduct(productDTO);
        product.setId(id);
        return productService.update(product);
    }

    @Override
    @DeleteMapping("/{id}")
    public Mono<Void> delete(@PathVariable UUID id) {
        return productService.delete(id);
    }

}
