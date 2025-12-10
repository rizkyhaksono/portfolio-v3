// Admin Module Type Definitions

// Project Types
export interface ProjectModel {
  id?: string;
  image: string;
  title: string;
  description: string;
  content: string;
  projectLink: string;
  sourceCodeLink?: string;
  isFeatured: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface ProjectListResponse {
  status: number;
  data: ProjectModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectResponse {
  status: number;
  data: ProjectModel;
}

// Work Experience Types
export interface WorkModel {
  id?: string;
  logo: string;
  jobTitle: string;
  content: string;
  instance: string;
  instanceLink: string;
  address: string;
  duration: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface WorkListResponse {
  status: number;
  data: WorkModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WorkResponse {
  status: number;
  data: WorkModel;
}

// Education Types
export interface EducationModel {
  id?: string;
  logo: string;
  instance: string;
  content: string;
  address: string;
  duration: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface EducationListResponse {
  status: number;
  data: EducationModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EducationResponse {
  status: number;
  data: EducationModel;
}

// Common Response Types
export interface DeleteResponse {
  status: number;
  message: string;
}

// Pagination Query
export interface PaginationQuery {
  page?: number;
  limit?: number;
}
