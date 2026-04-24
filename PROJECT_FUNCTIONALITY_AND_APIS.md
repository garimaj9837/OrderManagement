# Microservice-New: Functionality and API Documentation

## 1. Project Overview

`microservice-new` is an order management application built as a multi-module Spring Boot backend with an Angular frontend.

### Backend modules

- `customer-service` on port `8080`
- `order-service` on port `8081`
- `product-service` on port `8083`
- `payment-service` on port `8084`
- `auth-service` on port `8085`
- `apiGateway` on port `9090`

### Frontend

- Angular application in `frontend`
- Runs through API Gateway at `http://localhost:9090/api`
- Uses route guards and a JWT-based login flow
- Sends `Authorization: Bearer <jwt>` on authenticated API requests through an Angular HTTP interceptor

### Database usage

Each implemented Spring Boot service uses its own MySQL database:

- `customer-service` -> database `customer`
- `order-service` -> database `order`
- `product-service` -> database `product`
- `payment-service` -> database `payment`
- `auth-service` -> database `auth`

## 2. High-Level Functionalities

### Authentication and user access

- Users can register with username and password.
- Users can log in and receive a JWT token.
- The frontend stores the token in local storage.
- The frontend fetches the logged-in user profile after login.
- The frontend protects most routes using an auth guard.
- Normal users land on `/dashboard` after login.
- Normal users are prevented from being redirected to admin-only routes after login.
- API Gateway validates JWT tokens before routing protected API requests to downstream services.
- Role support exists in the frontend and user entity (`USER`, `ADMIN`), but registration currently always creates `USER`.

### Customer management

- Create a customer profile.
- View and update the signed-in user's customer profile through `/profile`.
- View all customers.
- View a customer by ID.
- Search a customer by email.
- Update customer details.
- Delete a customer.
- Validate whether a customer exists through an internal endpoint used by `order-service`.
- While creating a customer, the backend extracts the user ID from the JWT and stores it on the customer record.
- `/customer/me` uses the JWT user ID to load or update the signed-in user's customer profile.

### Product catalog and management

- Customers view products through the dashboard product catalog.
- Customers can search and filter products by category.
- Customers can add products to cart from the dashboard.
- Admins manage products through the `/products` area.
- Admins can create products.
- Admins can view all products in a management table.
- View a product by ID.
- Filter products by category.
- Admins can update full product details.
- Admins can update only product discount.
- Admins can delete a product.
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
- Customers cannot edit placed orders from the frontend.
- Customers can cancel an order, which updates order status to `CANCELLED`.
- Customers can cancel an order item from the order detail screen. Current behavior removes the item and recalculates order total.
- Admins can still create and edit orders from the admin-facing order form.
- Get all orders.
- Get a single order by ID.

### Cart and checkout behavior

- The frontend maintains a local cart in browser storage.
- The cart verifies stock against `product-service`.
- Checkout flow exists in the frontend.
- `order-service` exposes `/orders/cart` for cart validation.
- `order-service` exposes `/orders/placeOrder` for creating a real order from the cart request.
- `placeOrder` validates customer, validates item availability, saves the order, and reduces product stock through `product-service`.
- Frontend checkout calls `/orders/placeOrder`, then creates a mock payment record through `payment-service`.

### Payments

- The Angular frontend contains payment models, routes, forms, and API service methods.
- The Maven module `payment-service` exists.
- API Gateway has a route for `/api/payments/**` to `http://localhost:8084`.
- Backend payment controllers, entity, repository, and service are implemented for mock payment persistence.
- Checkout creates an order through `/orders/placeOrder` and then creates a payment record.

## 3. API Gateway And Service-to-Service Communication

### External API Gateway

The Angular frontend calls backend APIs through:

`http://localhost:9090/api`

Gateway routes:

| Gateway path | Downstream service | Strip prefix result |
| --- | --- | --- |
| `/api/auth/**` | `http://localhost:8085` | `/auth/**` |
| `/api/customer/**` | `http://localhost:8080` | `/customer/**` |
| `/api/orders/**` | `http://localhost:8081` | `/orders/**` |
| `/api/product/**` | `http://localhost:8083` | `/product/**` |
| `/api/payments/**` | `http://localhost:8084` | `/payments/**` |

Gateway security behavior:

- Allows public requests to `/api/auth/login` and `/api/auth/register`.
- Allows `OPTIONS` requests for browser CORS preflight.
- Requires `Authorization: Bearer <jwt>` for other gateway routes.
- Returns `401 Unauthorized` when the token is missing, invalid, or expired.
- Validates tokens using the same `jwt.secret` configured in `auth-service`.
- Adds `X-Authenticated-User-Id` before forwarding authenticated requests downstream.

Gateway CORS behavior:

- Allows Angular dev origins `http://localhost:4200` and `http://127.0.0.1:4200`.
- Uses `DedupeResponseHeader` for CORS response headers to avoid browser failures when downstream services also add CORS headers.

### Frontend API base URLs

The frontend now uses API Gateway URLs:

- Auth: `http://localhost:9090/api/auth`
- Customer: `http://localhost:9090/api/customer`
- Order: `http://localhost:9090/api/orders`
- Product: `http://localhost:9090/api/product`
- Payment: `http://localhost:9090/api/payments`

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
- `/profile`

### Customer-facing routes

- `/dashboard`
- `/cart`
- `/checkout`
- `/orders`
- `/profile`

### Admin-facing routes

- `/customers`
- `/products`
- `/payments`
- `/orders/create`
- `/orders/edit/:id`
- `/products/create`
- `/products/edit/:id`

### Feature screens present in frontend

- Login
- Register
- Dashboard product catalog
- My Profile
- Admin product list
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

Gateway base URL: `http://localhost:9090/api/auth`

Direct service URL: `http://localhost:8085/auth`

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

Gateway base URL: `http://localhost:9090/api/customer`

Direct service URL: `http://localhost:8080/customer`

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

### `GET /customer/me`

Returns the customer profile for the signed-in user.

Headers:

- `Authorization: Bearer <jwt>`

Behavior:

- extracts user ID from JWT
- finds customer by `userId`

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

### `PUT /customer/me`

Updates the customer profile for the signed-in user.

Headers:

- `Authorization: Bearer <jwt>`

Behavior:

- extracts user ID from JWT
- finds customer by `userId`
- updates email, customer name, address, and pincode

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

Gateway base URL: `http://localhost:9090/api/product`

Direct service URL: `http://localhost:8083/product`

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

Gateway base URL: `http://localhost:9090/api/orders`

Direct service URL: `http://localhost:8081/orders`

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

Frontend usage:

- used by the order detail screen as "Cancel Item"
- current backend behavior physically removes the item instead of preserving it with an item-level `CANCELLED` status

### `POST /orders/cart`

Cart validation endpoint using `OrderRequestDto`.

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

Behavior:

- validates the customer
- validates every requested product
- returns price, discount, subtotal, availability, and message for each item
- does not save an order
- does not reduce stock

### `POST /orders/placeOrder`

Places an order using `OrderRequestDto`.

Behavior:

- validates cart items
- rejects unavailable items
- creates a real order
- freezes product price and discount on each order item
- calculates order total
- reduces product stock
- returns the created order

### `GET /orders/customer/{customerId}`

Returns orders for a customer.

Frontend usage:

- normal users see only orders for their current customer profile

### `GET /orders?status={status}`

Returns orders filtered by order status.

### `PATCH /orders/{id}/status`

Updates order status.

Request body:

```json
{
  "status": "CANCELLED"
}
```

Frontend usage:

- normal users cancel orders through this endpoint

## 5.5 Payment Service

Gateway base URL: `http://localhost:9090/api/payments`

Direct service URL: `http://localhost:8084/payments`

Payment entity shape:

```json
{
  "paymentId": 1,
  "orderId": 10,
  "customerId": 2,
  "amount": 98000,
  "paymentMethod": "CREDIT_CARD",
  "paymentStatus": "COMPLETED",
  "transactionId": "MOCK-1713980000000",
  "paymentDate": "2026-04-25T00:00:00",
  "createdAt": "2026-04-25T00:00:00",
  "updatedAt": "2026-04-25T00:00:00"
}
```

### `POST /payments`

Creates a mock payment record.

Request body:

```json
{
  "orderId": 10,
  "customerId": 2,
  "amount": 98000,
  "paymentMethod": "CREDIT_CARD"
}
```

Behavior:

- defaults `paymentStatus` to `COMPLETED`
- generates a mock transaction id when not provided
- sets payment, created, and updated timestamps

### `GET /payments`

Returns all payments.

### `GET /payments/{paymentId}`

Returns one payment by ID.

### `PUT /payments/{paymentId}`

Updates payment details.

### `DELETE /payments/{paymentId}`

Deletes a payment.

### `GET /payments/order/{orderId}`

Returns payments for an order.

### `GET /payments/customer/{customerId}`

Returns payments for a customer.

### `PATCH /payments/{paymentId}/status`

Updates payment status.

Request body:

```json
{
  "status": "REFUNDED"
}
```

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

### API Gateway

- missing bearer token -> `401 Unauthorized`
- invalid JWT -> `401 Unauthorized`
- expired JWT -> `401 Unauthorized`
- CORS preflight requests are allowed through the gateway

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

- `order-service` date-range search is declared in the controller but not implemented.
- Payment service is currently a mock persistence backend and is not integrated with a real payment provider.
- Order item cancellation currently removes the item instead of storing an item-level status.

### Frontend/backend mismatches

- Frontend order endpoints now match backend for update order, delete order, update status, get orders by customer, cart validation, place order, and filter by status.
- Frontend routes payment calls through `/api/payments/**`, and API Gateway forwards to the implemented `payment-service` on port `8084`.
- Frontend profile flow now uses `/customer/me` instead of matching customer by username/email.

### Security and configuration concerns

- API Gateway now validates JWTs for protected routes, but downstream service-level authorization still needs to be tightened.
- Frontend route guards enforce some admin-only screens, including product management and order create/edit screens.
- Backend role-based authorization is not fully enforced yet. Admin-only APIs and user-owned resources still need stricter service-side checks.
- JWT contains the user id as subject, but role claims are not included yet.
- Database credentials and JWT secret are hardcoded in configuration files and should be moved to environment variables or external configuration.
- Internal service URLs are still hardcoded in configuration/classes and should become profile-driven or service-discovery driven.

## 9. Recommended Next Documentation/Engineering Improvements

- Replace mock payment behavior with a real payment gateway integration when needed.
- Add true item-level cancellation status instead of deleting cancelled order items.
- Lock down protected endpoints in customer, product, order, and payment services.
- Add a root `README` section describing startup order for all services and the frontend.
- Use `ORDER_MANAGEMENT_PRODUCT_REQUIREMENTS.md` as the product backlog for grocery and electronics order management requirements.
