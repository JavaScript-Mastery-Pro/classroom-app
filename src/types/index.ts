
export type SignUpPayload = {
  email: string;
  name: string;
  password: string;
  image?: string;
  imageCldPubId?: string;
  role: UserRole;
};

export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  imageCldPubId?: string;
  phone?: string;
  address?: string;
};

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
  type?: 'profile' | 'banner';
  maxSizeText?: string;
  currentImageUrl?: string;
};

