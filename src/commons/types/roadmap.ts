export type Roadmap = {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  modules: RoadmapModule[];
  totalRoadmap: number;
  completedRoadmap?: number;
}

export type RoadmapModule = {
  id: string;
  title: string;
  description: string;
  roadmaps: RoadmapLesson[];
  duration: string;
}

export type RoadmapLesson = {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  completed?: boolean;
}