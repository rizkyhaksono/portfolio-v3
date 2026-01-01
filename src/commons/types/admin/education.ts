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

export type CreateEducationInput = Omit<EducationModel, "id" | "created_at" | "updated_at">;
export type UpdateEducationInput = Partial<EducationModel>;
