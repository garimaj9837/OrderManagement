package com.orderManagement.orderService.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class ProductDto {
    
	private int productId;
	private String productName;
	private String productCategory;
	private int productquantity; 
	private BigDecimal productPrice;
	private BigDecimal productDiscount;
} 