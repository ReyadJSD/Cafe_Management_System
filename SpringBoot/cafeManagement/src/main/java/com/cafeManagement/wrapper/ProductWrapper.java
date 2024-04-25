package com.cafeManagement.wrapper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductWrapper {
    private Integer id;
    private String name;
    private String description;
    private Integer price;
    private String status;
    private Integer categoryId;
    private String categoryName;

    //Constructor for Get Product By Category Id
    public ProductWrapper(Integer id, String name){
        this.id = id;
        this.name = name;
    }

    //Constructor for Get Product By Id
    public ProductWrapper(Integer id, String name, String description, Integer price){
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
    }
}
