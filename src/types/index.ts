import { classSchema, facultySchema, subjectSchema } from "@/lib/schema";
import z from "zod";

export type SignUpPayload = {
  email: string;
  name: string;
  password: string;
  image?: string;
  imageCldPubId?: string;
  role: UserRole;
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

// ====== Resource types
export type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  imageCldPubId?: string;
  department?: string;
};

export type Subject = {
  id: number;
  name: string;
  code: string;
  description: string;
  department: string;
  createdAt?: string;
};

export type ClassSchedule = {
  day: string;
  startTime: string;
  endTime: string;
};

export type Class = {
  id: number;
  name: string;
  subjectId: number;
  teacherId: string;
  capacity?: number;
  description?: string;
  status: 'active' | 'inactive';
  bannerUrl?: string;
  bannerCldPubId?: string;
  schedules?: ClassSchedule[];
  subject?: Subject;
  teacher?: User;
  inviteCode?: string;
  students?: {
    id: string;
    name: string;
    email: string;
    enrolledAt: string;
    enrollmentId: string;
  }[];
};

// ====== Schema inferred types
export type FacultyFormValues = z.infer<typeof facultySchema>;

export type SubjectFormValues = z.infer<typeof subjectSchema>;

export type ClassFormValues = z.infer<typeof classSchema>;
