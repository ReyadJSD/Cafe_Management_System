package com.cafeManagement.dao;

import com.cafeManagement.POJO.Products;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDao extends JpaRepository<Products, Integer> {

}
