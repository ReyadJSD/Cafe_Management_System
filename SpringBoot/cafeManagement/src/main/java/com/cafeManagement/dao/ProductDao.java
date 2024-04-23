package com.cafeManagement.dao;

import com.cafeManagement.POJO.Products;
import com.cafeManagement.wrapper.ProductWrapper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductDao extends JpaRepository<Products, Integer> {

    List<ProductWrapper> getAllProducts();
}
