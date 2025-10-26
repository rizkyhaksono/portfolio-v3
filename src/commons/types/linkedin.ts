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
