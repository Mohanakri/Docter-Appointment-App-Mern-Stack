// Extend Express Request to include user
import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'doctor' | 'admin';
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

// User related types
export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// Doctor related types
export interface RegisterDoctorDto extends RegisterUserDto {
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  qualifications: string[];
  clinicAddress?: string;
  consultationFee: number;
  availableDays?: string[];
  availableTimeSlots?: TimeSlot[];
  bio?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DoctorFilters {
  specialization?: string;
  isVerified?: boolean;
  minFee?: number;
  maxFee?: number;
  minRating?: number;
}

// Token types
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  id: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

// Query parameter types
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface DoctorSearchQuery extends PaginationQuery {
  specialization?: string;
  isVerified?: string;
  minFee?: string;
  maxFee?: string;
}

// Error types
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}