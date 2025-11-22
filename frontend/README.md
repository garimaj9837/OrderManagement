# Microservice New - Order Management System (Angular Frontend)

A modern, production-ready Angular application for managing orders, customers, products, and payments in a microservices architecture.

## Features

- **Orders Management**: Create, view, edit, and delete orders with order items
- **Customer Management**: Full CRUD operations for customers
- **Product Management**: Manage product catalog with stock tracking
- **Payment Management**: Handle payment processing and tracking
- **Modern UI**: Responsive design with clean, user-friendly interface
- **Search & Filter**: Advanced search and filtering capabilities
- **Pagination**: Efficient data pagination for large datasets
- **Error Handling**: Comprehensive error handling and user feedback

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Angular CLI (v17 or higher)

## Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Install Angular CLI globally (if not already installed):**
   ```bash
   npm install -g @angular/cli
   ```

## Configuration

Before running the application, make sure to configure the API endpoints in `src/app/core/services/api.service.ts`:

```typescript
private readonly baseUrl = 'http://localhost:8082'; // Order Service
private readonly productServiceUrl = 'http://localhost:8081'; // Product Service
private readonly customerServiceUrl = 'http://localhost:8083'; // Customer Service
private readonly paymentServiceUrl = 'http://localhost:8084'; // Payment Service
```

Update these URLs to match your backend microservices ports.

## Running the Application

1. **Start the development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   ng serve
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:4200
   ```

3. **For production build:**
   ```bash
   npm run build
   ```
   The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/          # Core services (API, Order, Customer, Product, Payment)
│   │   ├── features/
│   │   │   ├── orders/            # Orders feature module
│   │   │   ├── customers/         # Customers feature module
│   │   │   ├── products/          # Products feature module
│   │   │   └── payments/           # Payments feature module
│   │   ├── models/                # TypeScript interfaces/models
│   │   ├── shared/
│   │   │   └── components/        # Reusable UI components
│   │   ├── app.component.*        # Root component
│   │   └── app.routes.ts          # Application routing
│   ├── assets/                    # Static assets
│   ├── styles.scss                # Global styles
│   ├── index.html                 # Main HTML file
│   └── main.ts                    # Application entry point
├── angular.json                   # Angular configuration
├── package.json                   # Dependencies
└── tsconfig.json                  # TypeScript configuration
```

## Key Components

### Shared Components

- **DataTableComponent**: Reusable table with sorting, pagination, and actions
- **PaginationComponent**: Pagination controls
- **SearchFilterComponent**: Search and filter functionality

### Feature Modules

Each feature module includes:
- List component (with search, filter, pagination)
- Form component (create/edit)
- Detail component (view details)

## API Integration

The application integrates with the following microservices:

- **Order Service** (Port 8082): Order management endpoints
- **Product Service** (Port 8081): Product catalog endpoints
- **Customer Service** (Port 8083): Customer management endpoints
- **Payment Service** (Port 8084): Payment processing endpoints

## Development

### Adding a New Feature

1. Create a new feature module in `src/app/features/`
2. Add routes in the feature's `*.routes.ts` file
3. Update `app.routes.ts` to include the new feature
4. Create components following the existing pattern

### Code Style

- Use TypeScript strict mode
- Follow Angular style guide
- Use standalone components
- Implement proper error handling
- Add loading states for async operations

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure your backend services have CORS enabled for `http://localhost:4200`.

### API Connection Issues

- Verify all backend services are running
- Check API endpoint URLs in `api.service.ts`
- Verify network connectivity
- Check browser console for detailed error messages

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Angular cache: `ng cache clean`
- Update Angular CLI: `npm install -g @angular/cli@latest`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Microservice New Order Management System.

## Support

For issues and questions, please check the main project documentation or contact the development team.

