# Order Management Product Requirements And Backlog

## Goal

Build a standard order management application for selling groceries and electronics, with secure customer shopping, admin catalog management, inventory control, checkout, payments, and order tracking.

## Current Diagnosis

The application already has a strong foundation:

- JWT authentication through `auth-service`
- JWT validation in `apiGateway`
- Angular frontend with login, register, dashboard catalog, cart, checkout, profile, product, customer, order, and payment screens
- Customer, product, order, payment, auth, and API gateway backend services
- Gateway routing for frontend requests
- Customer profile can be viewed and updated through `My Profile`
- Checkout can create an order through `/orders/placeOrder`
- Mock payment records are persisted through `payment-service`
- Normal users see only their own orders in the frontend
- Product management routes are admin-only in the frontend

The main remaining gaps are domain completeness, service-side authorization, order lifecycle depth, item-level cancellation history, inventory correctness, real payment integration, production secret management, and deployment hardening.

## Phase 1: Critical Bugs And Stabilization

1. Fix order endpoint mismatches.
   - Status: Done.
   - Backend now supports `/orders/customer/{customerId}` and `/orders/{id}/status`.

2. Implement missing order service methods.
   - Status: Partially done.
   - Done: update order, delete order, update order status, get orders by customer, get orders by status.
   - Remaining:
   - Get orders by date range

3. Fix cart and checkout backend flow.
   - Status: Done for the current mock checkout flow.
   - `/orders/cart` validates items and returns availability details.
   - `/orders/placeOrder` creates a real order, calculates totals, reduces stock, and returns the order.
   - Frontend checkout calls `/orders/placeOrder`, then creates a mock payment record.

4. Implement `payment-service` backend.
   - Status: Done as a mock persistence backend.
   - Payment entity, repository, service, controller, and PostgreSQL configuration exist.
   - Remaining: real payment gateway integration, refunds, payment attempts, and robust failure handling.

5. Prevent stock inconsistency.
   - Status: Open.
   - Current stock reduction can fail after an order is saved.
   - Add transactional handling or compensating logic.

6. Remove direct service CORS dependency.
   - API Gateway should own external CORS.
   - Downstream services should not need frontend origin configuration.

7. Fix hardcoded secrets and configuration.
   - Status: Partially done.
   - Spring services now support `local`, `docker`, and `prod` profiles.
   - PostgreSQL connection settings, JWT secret, frontend origin, gateway route URIs, and internal service URLs can be supplied through environment variables.
   - Angular now reads the API base URL from environment files.
   - Remaining: use a real secret manager in production and add migration tooling instead of relying on Hibernate auto-update.

8. Fix customer profile access.
   - Status: Done for current frontend flow.
   - `/customer/me` loads and updates the signed-in user's customer profile using JWT user id.
   - Frontend has `My Profile` route.

9. Restrict product management to admins.
   - Status: Done on the frontend.
   - `/products`, `/products/create`, and `/products/edit/:id` are admin-only routes.
   - Remaining: enforce the same rule in backend services or gateway authorization.

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

Current status:

- Register, login, logout, profile view/update, and own-order view are implemented in the frontend flow.
- Change password is not implemented.
- Backend service-side ownership enforcement still needs to be tightened.

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
   - Current status: Done.
2. Validate customer address.
   - Current status: Partially done through customer profile presence.
3. Validate stock.
   - Current status: Done during cart validation and order creation.
4. Freeze product price at purchase time.
   - Current status: Done.
5. Reduce stock only after order confirmation or payment.
   - Current status: Partially done. Stock is reduced when order is created, before robust payment confirmation.
6. Add order history timeline.
   - Current status: Open.
7. Allow cancellation before shipping.
   - Current status: Partially done. Frontend can cancel order by setting status to `CANCELLED`.
8. Support partial cancellation.
   - Current status: Partially done. Frontend can cancel an item, but backend currently deletes the item.
9. Support return and refund for eligible products.
   - Current status: Open.
10. Generate order invoice.
   - Current status: Open.

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

Current status:

- Mock `payment-service` backend is implemented.
- It supports create, list, get by id, update, delete, get by order, get by customer, and update status.
- It persists payments in PostgreSQL.

Target `payment-service` should evolve toward these entities:

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

- Current: `POST /payments`
- Current: `GET /payments`
- Current: `GET /payments/{id}`
- Current: `PUT /payments/{id}`
- Current: `DELETE /payments/{id}`
- Current: `GET /payments/order/{orderId}`
- Current: `GET /payments/customer/{customerId}`
- Current: `PATCH /payments/{id}/status`
- Future: `POST /payments/initiate`
- Future: `POST /payments/confirm`
- Future: `POST /payments/{id}/refund`

Start with mock payment processing. Later, integrate a real provider such as Razorpay, Stripe, or PayPal.

## Phase 6: Admin Features

Admin users should be able to:

1. Create, update, and delete products.
   - Current frontend status: Done.
   - Backend service-side role enforcement: Open.
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
   - Current status: Done.
10. Update cart quantity.
   - Current status: Done.
11. Save for later.
12. Checkout page.
   - Current status: Done with mock payment flow.
13. Address selection.
14. Payment selection.
15. Order confirmation page.
16. My Orders page.
   - Current status: Done.
17. Reorder previous order.
   - Current status: Open.
18. Cancel order.
   - Current status: Partially done.
19. Return order.
   - Current status: Open.

## Phase 8: Security And Access Control

Security requirements:

1. Add roles: `CUSTOMER`, `ADMIN`, and optionally `STAFF`.
   - Current status: `USER` and `ADMIN` exist.
2. Include role in JWT claims.
   - Current status: Open.
3. Enforce route access in API Gateway or downstream services.
   - Current status: Partially done in frontend route guards. Backend enforcement remains open.
4. Admin APIs should require admin role.
   - Current status: Open on backend.
5. Users should only access their own customer profile and orders.
   - Current status: Partially done in frontend and `/customer/me`; backend order ownership enforcement remains open.
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
10. Add Docker Compose for PostgreSQL and services.
   - Status: Done for local Docker development.
   - Remaining: add production-grade compose/Kubernetes deployment manifests, health checks per service, and externalized secrets.

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

Current verification already performed manually through build/test commands:

- `mvn -pl apiGateway test`
- `mvn -pl auth-service/customer-service/order-service/payment-service test` as relevant during implementation
- `npm run build`

## Suggested Build Order

1. Add service-side authorization for admin-only APIs and user-owned resources.
2. Add role claims to JWT.
3. Replace item deletion with true order-item cancellation status.
4. Improve product model for groceries and electronics.
5. Add address management with multiple saved addresses.
6. Add order status lifecycle and order history timeline.
7. Add inventory reservation.
8. Add real payment gateway integration and refunds.
9. Add admin dashboard.
10. Add search, filter, pagination, and sorting APIs.
11. Add broader tests and OpenAPI documentation.

## Most Important Immediate Milestone

Current milestone completed:

`cart -> validate stock -> create order -> mock payment -> confirm order -> reduce stock -> show order confirmation`

Next most important milestone:

`secure ownership and admin APIs -> item-level cancellation status -> inventory reservation -> real payment confirmation -> production deployment hardening`

This will move the app from a working local commerce flow toward a safer standard order management system.
