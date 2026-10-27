package com.example.products;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

class ProductServiceTest {

    private final ProductRepository repository = mock(ProductRepository.class);
    private final ProductService service = new ProductService(repository);

    @Test
    void createTrimsNameBeforeSaving() {
        when(repository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            ReflectionTestUtils.setField(product, "id", 1L);
            return product;
        });

        ProductResponse response = service.create("  P1  ");

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        Mockito.verify(repository).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("P1");
        assertThat(response).isEqualTo(new ProductResponse(1L, "P1"));
    }

    @Test
    void listMapsRepositoryResultsInOrder() {
        Product first = new Product("A");
        Product second = new Product("B");
        ReflectionTestUtils.setField(first, "id", 1L);
        ReflectionTestUtils.setField(second, "id", 2L);
        when(repository.findAllByOrderByIdAsc()).thenReturn(List.of(first, second));

        assertThat(service.list()).containsExactly(
                new ProductResponse(1L, "A"),
                new ProductResponse(2L, "B"));
    }
}
