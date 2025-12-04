import 'better-auth/client';

declare module 'better-auth/client' {
  interface User {
    role: string;
    department?: string;
    imageCldPubId?: string;
  }

  interface Session {
    user: User;
  }
}