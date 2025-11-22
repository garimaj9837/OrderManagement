export interface Customer {
  customerId: number;
  email: string;
  customerName: string;
  address: string;
  pincode: number;
}

export interface CustomerRequest {
  email: string;
  customerName: string;
  address: string;
  pincode: number;
}

