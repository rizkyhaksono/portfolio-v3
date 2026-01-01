// Common Types
export interface DeleteResponse {
  status: number;
  message: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

export interface PaginatedResponse<T> {
  status: number;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
