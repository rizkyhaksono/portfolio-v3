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

export type CreateWorkInput = Omit<WorkModel, "id" | "created_at" | "updated_at">;
export type UpdateWorkInput = Partial<WorkModel>;
