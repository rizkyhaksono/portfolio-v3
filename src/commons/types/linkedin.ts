export interface LinkedinRecommendation {
  id: number;
  name: string;
  image: string;
  message: string;
}

export interface LinkedinRecommendationsApiResponse {
  success: boolean;
  data: LinkedinRecommendation[];
  total: number;
}

export interface LinkedinCertification {
  id: number;
  title: string;
  provider: string;
  issued: string; // ISO date string
  issuedDisplay: string; // e.g., "Nov 2025"
  image: string;
  link: string;
}

export interface LinkedinCertificationsResponse {
  success: boolean;
  data: LinkedinCertification[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  prev: number | null;
  next: number | null;
}


