interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  address?: string;
  phoneNumber?: string;
}

interface UserResponse {
  user: User;
  token: {
    type: string;
    name: string | null;
    token: string;
    abilities: string[];
    lastUsedAt: string | null;
    expiresAt: string | null;
  }
}