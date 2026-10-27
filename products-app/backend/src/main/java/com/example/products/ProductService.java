package com.example.products;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> list() {
        return productRepository.findAllByOrderByIdAsc().stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional
    public ProductResponse create(String name) {
        Product saved = productRepository.save(new Product(name.trim()));
        return ProductResponse.from(saved);
    }
}
