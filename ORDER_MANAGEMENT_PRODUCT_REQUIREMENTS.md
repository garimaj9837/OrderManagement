# Order Management Product Requirements And Backlog

## Goal

Build a standard order management application for selling groceries and electronics, with secure customer shopping, admin catalog management, inventory control, checkout, payments, and order tracking.

## Current Diagnosis

The application already has a strong foundation:

- JWT authentication through `auth-service`
- JWT validation in `apiGateway`
- Angular frontend with login, register, dashboard, cart, checkout, product, customer, order, and payment screens
- Customer, product, and order backend services
- Gateway routing for frontend requests

The main gaps are domain completeness, missing backend implementations, payment service, order lifecycle, inventory correctness, security authorization, and production-style configuration.

## Phase 1: Critical Bugs And Stabilization

1. Fix order endpoint mismatches.
   - Frontend expects endpoints like `/orders/customer/{customerId}` and `/orders/{id}/status`.
   - Backend mappings are incomplete or do not match the frontend.

2. Implement missing order service methods.
   - Update order
   - Delete order
   - Update order status
   - Get orders by customer
   - Get orders by status
   - Get orders by date range

3. Fix cart and checkout backend flow.
   - `/orders/cart` currently returns `null`.
   - `/orders/placeOrder` should create a real order, reduce stock, and return an order confirmation.

4. Implement `payment-service` backend.
   - Frontend payment screens exist.
   - Backend payment APIs, entities, repositories, and services are missing.

5. Prevent stock inconsistency.
   - Current stock reduction can fail after an order is saved.
   - Add transactional handling or compensating logic.

6. Remove direct service CORS dependency.
   - API Gateway should own external CORS.
   - Downstream services should not need frontend origin configuration.

7. Fix hardcoded secrets and configuration.
   - Move DB passwords, JWT secret, and service URLs to environment variables or Spring profiles.

## Phase 2: Core Product Requirements

### User Account Management

Users should be able to:

- Register
- Login
- View profile
- Update profile
- Change password
- Logout
- View their own orders only

### Customer Profile Management

Customer profile should support:

- Full name
- Email
- Phone number
- Default address
- Multiple saved addresses
- Pincode
- City
- State
- Delivery instructions

### Product Catalog

Products should support:

- SKU
- Name
- Description
- Brand
- Category
- Subcategory
- Images
- Price
- Discount
- Stock quantity
- Status: `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`
- Tags
- Created timestamp
- Updated timestamp

### Grocery-Specific Product Fields

Groceries should support:

- Weight or volume, such as `1kg`, `500g`, `1L`
- Expiry date
- Manufacture date
- Perishable flag
- Storage type: `ROOM_TEMP`, `REFRIGERATED`, `FROZEN`
- Organic flag
- Nutrition info
- Unit type: `KG`, `GRAM`, `LITER`, `PIECE`, `PACK`

### Electronics-Specific Product Fields

Electronics should support:

- Warranty period
- Model number
- Serial number support
- Technical specifications
- Return window
- Installation required flag
- Power rating
- Color or variant
- Included accessories

## Phase 3: Order Lifecycle

Use a clear order state machine.

Recommended order statuses:

- `CART`
- `PLACED`
- `PAYMENT_PENDING`
- `PAYMENT_COMPLETED`
- `CONFIRMED`
- `PACKED`
- `SHIPPED`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELLED`
- `RETURN_REQUESTED`
- `RETURNED`
- `REFUNDED`

Tasks:

1. Create order from cart.
2. Validate customer address.
3. Validate stock.
4. Freeze product price at purchase time.
5. Reduce stock only after order confirmation or payment.
6. Add order history timeline.
7. Allow cancellation before shipping.
8. Support partial cancellation.
9. Support return and refund for eligible products.
10. Generate order invoice.

## Phase 4: Inventory Management

Inventory requirements:

1. Maintain available stock and reserved stock.
2. Reserve stock during checkout.
3. Release reservation if payment fails or times out.
4. Prevent negative stock.
5. Track low-stock products.
6. Notify admin about low stock.
7. Add stock adjustment reason.
   - Purchase
   - Sale
   - Return
   - Damaged
   - Manual correction
8. Add inventory history table.
9. Support batch or lot tracking for groceries.
10. Support serial number tracking for expensive electronics.

## Phase 5: Payment Service

Build `payment-service` with these entities:

- Payment
- Refund
- PaymentAttempt

Payment fields:

- `paymentId`
- `orderId`
- `customerId`
- `amount`
- `method`: `CARD`, `UPI`, `COD`, `NET_BANKING`, `WALLET`
- `status`: `INITIATED`, `SUCCESS`, `FAILED`, `REFUNDED`
- `transactionReference`
- `paymentDate`

Payment APIs:

- `POST /payments/initiate`
- `POST /payments/confirm`
- `GET /payments/{id}`
- `GET /payments/order/{orderId}`
- `POST /payments/{id}/refund`
- `PATCH /payments/{id}/status`

Start with mock payment processing. Later, integrate a real provider such as Razorpay, Stripe, or PayPal.

## Phase 6: Admin Features

Admin users should be able to:

1. Create, update, and delete products.
2. Manage categories.
3. View all customers.
4. View all orders.
5. Update order status.
6. View payments.
7. Issue refunds.
8. Manage stock.
9. View dashboard metrics.

Admin dashboard metrics:

- Total sales
- Orders today
- Pending orders
- Low stock products
- Top-selling products
- Failed payments

## Phase 7: Customer Shopping Experience

Frontend requirements:

1. Product search.
2. Category filter.
3. Price filter.
4. Brand filter.
5. Availability filter.
6. Sort by price, popularity, and newest.
7. Product detail page.
8. Product images.
9. Add to cart.
10. Update cart quantity.
11. Save for later.
12. Checkout page.
13. Address selection.
14. Payment selection.
15. Order confirmation page.
16. My Orders page.
17. Reorder previous order.
18. Cancel order.
19. Return order.

## Phase 8: Security And Access Control

Security requirements:

1. Add roles: `CUSTOMER`, `ADMIN`, and optionally `STAFF`.
2. Include role in JWT claims.
3. Enforce route access in API Gateway or downstream services.
4. Admin APIs should require admin role.
5. Users should only access their own customer profile and orders.
6. Protect internal service endpoints.
7. Add token expiry handling in frontend.
8. Add refresh token flow.
9. Add logout or token invalidation strategy.
10. Never expose password fields.

## Phase 9: Data Quality And Validation

Backend validation requirements:

1. Required fields.
2. Positive product price.
3. Non-negative discount.
4. Discount cannot exceed price.
5. Quantity must be greater than zero.
6. Email format validation.
7. Phone number validation.
8. Pincode validation.
9. Product category validation.
10. Enum validation for statuses.

## Phase 10: Architecture Improvements

Architecture tasks:

1. Add a shared error response format across all services.
2. Use DTOs instead of exposing entities directly.
3. Add pagination to list APIs.
4. Add sorting and filtering query params.
5. Make service URLs config-driven.
6. Add centralized configuration.
7. Add logs with correlation or request ID.
8. Add health checks.
9. Add OpenAPI or Swagger documentation.
10. Add Docker Compose for MySQL and services.

## Phase 11: Testing Requirements

Minimum test coverage:

1. Auth login and register tests.
2. Gateway JWT validation tests.
3. Product CRUD tests.
4. Stock reduction tests.
5. Order creation tests.
6. Out-of-stock tests.
7. Cart validation tests.
8. Payment success and failure tests.
9. Role-based access tests.
10. Angular service and component tests for checkout flow.

## Suggested Build Order

1. Complete order backend missing methods.
2. Fix cart and `placeOrder` flow.
3. Implement mock `payment-service` backend.
4. Add role claims to JWT and enforce admin/customer access.
5. Improve product model for groceries and electronics.
6. Add address management.
7. Add order status lifecycle.
8. Add inventory reservation.
9. Add admin dashboard.
10. Add search, filter, and pagination.
11. Add tests and API documentation.

## Most Important Immediate Milestone

Make checkout end-to-end:

`cart -> validate stock -> create order -> mock payment -> confirm order -> reduce stock -> show order confirmation`

This will turn the application from screens plus services into a real working commerce flow.
