type UserType = 'customer' | 'partner' | 'admin'

export interface LoginPayload {
  email: string;
  password: string;
  role: UserType;
  rememberMe: boolean;
  adminCode?: string | undefined; 
}

// Base fields common to ALL users
interface BaseRegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// Customer-specific
interface CustomerPayload extends BaseRegisterPayload {
  role: 'customer';
  address: string;
  newsletter?: false,
}

// Partner-specific  
interface PartnerPayload extends BaseRegisterPayload {
  role: 'partner';
  address: string;
}

// Admin-specific
interface AdminPayload extends BaseRegisterPayload {
  role: 'admin';
  adminCode: string;
}

// The union type your API accepts
type RegisterPayload = CustomerPayload | PartnerPayload | AdminPayload;
export type { CustomerPayload, PartnerPayload, AdminPayload, RegisterPayload };

// export interface RegisterPayload {
//   name: string;
//   email: string;
//   phone: string;
//   address?: string;
//   password: string;
//   confirmPassword: string;
//   agreeToTerms: false,
//   newsletter?: false,
//   adminCode?: string,
//   role?: 'customer' | 'partner' | 'admin';
// }


export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    isActive: boolean;
    isApproved?: boolean;
  };
}