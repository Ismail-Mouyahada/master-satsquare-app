export interface UserDTO {
  id: number;
  pseudo: string;
  email: string;
  role: string | null;
  association_id: number | null;
  sponsor_id: number | null;
  walletId?: string; // Optional field for wallet ID
  balance?: number;  // Optional field for wallet balance in sats
}
