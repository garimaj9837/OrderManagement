export interface Payment {
  paymentId: number;
  orderId: number;
  customerId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  paymentDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentRequest {
  orderId: number;
  customerId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

