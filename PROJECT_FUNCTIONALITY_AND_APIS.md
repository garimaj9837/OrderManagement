# Microservice-New: Functionality and API Documentation

## 1. Project Overview

`microservice-new` is an order management application built as a multi-module Spring Boot backend with an Angular frontend.

### Backend modules

- `customer-service` on port `8080`
- `order-service` on port `8081`
- `product-service` on port `8083`
- `payment-service` intended for port `8084`, but backend implementation is currently missing
- `auth-service` on port `8085`

### Frontend

- Angular application in `frontend`
- Runs against locally hosted backend services
- Uses route guards and a JWT-based login flow

### Database usage

Each implemented Spring Boot service uses its own MySQL database:

- `customer-service` -> database `customer`
- `order-service` -> database `order`
- `product-service` -> database `product`
- `auth-service` -> database `auth`

## 2. High-Level Functionalities

### Authentication and user access

- Users can register with username and password.
- Users can log in and receive a JWT token.
- The frontend stores the token in local storage.
- The frontend fetches the logged-in user profile after login.
- The frontend protects most routes using an auth guard.
- Role support exists in the frontend and user entity (`USER`, `ADMIN`), but registration currently always creates `USER`.

### Customer management

- Create a customer profile.
- View all customers.
- View a customer by ID.
- Search a customer by email.
- Update customer details.
- Delete a customer.
- Validate whether a customer exists through an internal endpoint used by `order-service`.
- While creating a customer, the backend extracts the user ID from the JWT and stores it on the customer record.

### Product management

- Create products.
- View all products.
- View a product by ID.
- Filter products by category.
- Update full product details.
- Update only product discount.
- Delete a product.
- Reduce stock after orders are placed.

### Order management

- Create an order with one or more items.
- Validate the customer through `customer-service` before saving the order.
- Validate product availability through `product-service`.
- Copy product price and discount into each order item at order time.
- Calculate per-item subtotal and total order amount.
- Reduce stock in `product-service` after successful order creation.
- Add an item to an existing order.
- Update an item in an existing order.
- Delete an item from an existing order.
- Get all orders.
- Get a single order by ID.

### Cart and checkout behavior

- The frontend maintains a local cart in browser storage.
- The cart verifies stock against `product-service`.
- Checkout flow exists in the frontend.
- `order-service` exposes `/orders/cart` and `/orders/placeOrder`, but cart response logic is not implemented yet.
- `placeOrder` currently calls the same unimplemented service method as `cart`.

### Payments

- The Angular frontend contains payment models, routes, forms, and API service methods.
- The Maven module `payment-service` exists.
- No backend payment controllers, entities, repositories, or services are currently present.
- Payment functionality is therefore planned in the UI, but not implemented on the backend.

## 3. Service-to-Service Communication

### `order-service` -> `customer-service`

- Uses `RestTemplate`
- Base URL from configuration: `http://localhost:8080/customer`
- Used to validate customer IDs before an order is created

### `order-service` -> `product-service`

- Uses `WebClient`
- Calls product endpoints to:
  - fetch product details
  - check stock
  - reduce stock

## 4. Frontend Routes and Screens

### Public routes

- `/login`
- `/register`

### Auth-protected routes

- `/dashboard`
- `/cart`
- `/checkout`
- `/orders`
- `/customers`
- `/products`
- `/payments`

### Feature screens present in frontend

- Login
- Register
- Dashboard
- Product list
- Product create/edit form
- Customer list
- Customer detail
- Customer create/edit form
- Order list
- Order detail
- Order create/edit form
- Cart
- Checkout
- Payment list
- Payment create form

## 5. Backend API Reference

## 5.1 Auth Service

Base URL: `http://localhost:8085/auth`

### `POST /auth/register`

Registers a new user.

Request body:

```json
{
  "username": "john",
  "password": "secret"
}
```

Response:

- `200 OK`
- plain text: `User Registered Successfully`

Notes:

- Password is stored in bcrypt-encoded form.
- New users are always assigned role `USER`.

### `POST /auth/login`

Authenticates a user and returns a JWT token.

Request body:

```json
{
  "username": "john",
  "password": "secret"
}
```

Response:

- `200 OK`
- plain text JWT token

### `GET /auth/user/{username}`

Returns user details by username.

Response shape:

```json
{
  "id": 1,
  "username": "john",
  "password": null,
  "role": "USER"
}
```

### `GET /auth/users`

Returns all users.

Response:

- array of users
- passwords are set to `null` before returning

## 5.2 Customer Service

Base URL: `http://localhost:8080/customer`

Customer entity shape:

```json
{
  "customerId": 1,
  "userId": 10,
  "email": "john@example.com",
  "customerName": "John",
  "address": "Delhi",
  "pincode": 110001
}
```

### `GET /customer` or `GET /customer/`

Returns all customers.

### `POST /customer` or `POST /customer/`

Creates a customer.

Request body:

```json
{
  "email": "john@example.com",
  "customerName": "John",
  "address": "Delhi",
  "pincode": 110001
}
```

Headers:

- `Authorization: Bearer <jwt>`

Behavior:

- extracts user ID from JWT
- stores it in the customer record
- rejects duplicate email addresses

### `GET /customer/{id}`

Returns a customer by ID.

### `PUT /customer/{id}`

Updates customer fields.

Request body:

```json
{
  "email": "john@example.com",
  "customerName": "John Updated",
  "address": "Mumbai",
  "pincode": 400001
}
```

### `DELETE /customer/{id}`

Deletes a customer by ID.

Response:

- `200 OK`
- plain text: `Deleted Successfully!`

### `GET /customer/isValid/{id}`

Internal validation endpoint used by `order-service`.

Response:

- `true` or `false`

### `GET /customer/email/{email}`

Returns a customer by email.

## 5.3 Product Service

Base URL: `http://localhost:8083/product`

Product entity shape:

```json
{
  "productId": 1,
  "productName": "Laptop",
  "productCategory": "Electronics",
  "productquantity": 10,
  "productPrice": 50000,
  "productDiscount": 2000
}
```

### `GET /product/`

Returns all products.

### `POST /product/`

Creates a product.

Request body:

```json
{
  "productName": "Laptop",
  "productCategory": "Electronics",
  "productquantity": 10,
  "productPrice": 50000,
  "productDiscount": 2000
}
```

### `PUT /product/{id}`

Updates a full product record.

### `PATCH /product/discount/{id}`

Updates only the discount.

Request body:

```json
1500
```

### `GET /product/id/{id}`

Returns product by ID.

### `GET /product/category/{category}`

Returns all products in the given category.

### `DELETE /product/{id}`

Deletes a product.

Response:

- `200 OK`
- `Product deleted Successfully!`

### `PUT /product/reduceStock/{id}?quantity={n}`

Reduces available stock for a product.

Example:

`PUT /product/reduceStock/5?quantity=2`

Response:

- success message containing remaining quantity

## 5.4 Order Service

Base URL: `http://localhost:8081/orders`

Order entity shape:

```json
{
  "orderId": 1,
  "customerId": 2,
  "orderDate": "2026-04-23T14:30:00",
  "status": "PLACED",
  "totalAmount": 98000,
  "orderitems": [
    {
      "id": 1,
      "productId": 4,
      "quantity": 2,
      "price": 50000,
      "discount": 2000,
      "subtotal": 98000
    }
  ]
}
```

### `POST /orders` or `POST /orders/`

Creates an order from the `Order` entity payload.

Typical request body:

```json
{
  "customerId": 2,
  "orderitems": [
    {
      "productId": 4,
      "quantity": 2
    }
  ]
}
```

Behavior:

- validates customer through `customer-service`
- fetches product details from `product-service`
- validates stock
- sets `orderDate`
- sets status to `PLACED`
- calculates subtotal and total amount
- saves order and items
- reduces product stock after saving

### `GET /orders/{id}`

Returns one order by ID.

### `GET /orders` or `GET /orders/`

Returns all orders.

### `POST /orders/addItem/{orderId}/items`

Adds a line item to an existing order.

Request body:

```json
{
  "productId": 4,
  "quantity": 1
}
```

### `PUT /orders/updateItem/{orderId}/item/{itemId}`

Updates an existing order item.

Request body:

```json
{
  "productId": 4,
  "quantity": 3
}
```

Note:

- implementation recalculates price, discount, subtotal, and order total

### `DELETE /orders/deleteitem/{orderId}/items/{itemId}`

Deletes an item from an order and recalculates the order total.

### `POST /orders/cart`

Planned cart validation endpoint using `OrderRequestDto`.

Request body:

```json
{
  "customerId": 2,
  "orderitemRequest": [
    {
      "productId": 4,
      "quantity": 1
    }
  ]
}
```

Current status:

- controller exists
- service method currently returns `null`

### `POST /orders/placeOrder`

Intended order placement endpoint using `OrderRequestDto`.

Current status:

- controller exists
- currently calls the same unimplemented method as `/orders/cart`

## 6. DTOs Used Across the Order Flow

### `OrderRequestDto`

```json
{
  "orderId": 0,
  "customerId": 2,
  "orderDate": "2026-04-23T14:30:00",
  "status": "PLACED",
  "orderitemRequest": [
    {
      "productId": 4,
      "quantity": 2
    }
  ]
}
```

### `OrderItemResponseDto`

```json
{
  "id": 1,
  "productId": 4,
  "quantity": 2,
  "price": 50000,
  "discount": 2000,
  "subtotal": 98000,
  "available": true,
  "message": "Available"
}
```

## 7. Error Handling Summary

### Auth service

- returns JSON with `error` and `message`
- invalid username/password maps to `401 Unauthorized`

### Customer service

- customer not found -> `404`
- duplicate customer email -> `409`
- unexpected error -> `500`

### Product service

- product not found -> `404`

### Order service

- order not found -> `404`
- out of stock -> `400`

## 8. Important Current Gaps and Mismatches

### Backend gaps

- `payment-service` backend implementation is missing.
- `order-service` methods for update order, patch status, delete order, filter by customer, filter by status, and date-range search are declared in the controller but not implemented.
- `addToCart` in `OrderServiceImpl` returns `null`.
- `/orders/placeOrder` does not place an order through `createOrderFromDto`; it currently calls the unimplemented cart method.

### Frontend/backend mismatches

- Frontend expects `PATCH /orders/{id}/status`, but backend controller only declares `PATCH /orders/{id}` and has no implementation.
- Frontend expects `GET /orders/customer/{customerId}`, but backend does not expose that endpoint.
- Frontend expects a payment backend on port `8084`, but no payment APIs are implemented.

### Security and configuration concerns

- JWT validation filter exists in `customer-service`, but `/customer/**` is configured as permitted for all requests, so endpoint protection is currently loose.
- Database credentials and JWT secret are hardcoded in `application.properties` files and should be moved to environment variables or external configuration.

## 9. Recommended Next Documentation/Engineering Improvements

- Implement `payment-service` backend or remove payment UI until ready.
- Complete `OrderServiceImpl.addToCart()` and connect `/orders/placeOrder` to real order creation from `OrderRequestDto`.
- Align frontend order endpoints with backend controller mappings.
- Lock down protected endpoints in customer and other services.
- Add a root `README` section describing startup order for all services and the frontend.

