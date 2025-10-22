interface User {
  id?: number;
  fullName: string;
  email: string;
  role?: "user" | "vendor" | null | undefined;
  address?: string;
  phoneNumber: string;
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