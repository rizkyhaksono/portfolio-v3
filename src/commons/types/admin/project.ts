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

export type CreateProjectInput = Omit<ProjectModel, "id" | "created_at" | "updated_at">;
export type UpdateProjectInput = Partial<ProjectModel>;
