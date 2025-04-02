export interface User {
  _id: string;
  role: 'admin' | 'donar' | 'hospital' | 'organization';
  name: string;
  email: string;
  phone: string;
  organizationName?: string;
  hospitalName?: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  _id: string;
  inventoryType: 'in' | 'out';
  bloodGroup: string;
  quantity: number;
  email: string;
  organization: {
    name: string;
    email: string;
    address: string;
  };
  hospital?: {
    hospitalName: string;
    email: string;
  };
  donar?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse extends ApiResponse<{ token: string }> {}

export interface InventoryResponse extends ApiResponse<Inventory[]> {}

export interface UserResponse extends ApiResponse<User> {}