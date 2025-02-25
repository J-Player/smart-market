package com.smartmarket.api.mappers.product;

import com.smartmarket.api.models.dtos.product.ProductDTO;
import com.smartmarket.api.models.entities.product.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toProduct(ProductDTO productDTO);

    ProductDTO toProductDTO(Product product);

}
