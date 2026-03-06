import { useState, useEffect } from 'react';

// Structure: { courseId: ['module-slug-1', 'module-slug-2'] }
type ProgressData = Record<string, string[]>;

export function useRoadmapProgress() {
  const [progress, setProgress] = useState<ProgressData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('roadmap_progress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse roadmap progress', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when progress changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('roadmap_progress', JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  const markAsComplete = (courseId: string, moduleSlug: string) => {
    setProgress((prev) => {
      const courseProgress = prev[courseId] || [];
      if (courseProgress.includes(moduleSlug)) {
        return prev;
      }
      return {
        ...prev,
        [courseId]: [...courseProgress, moduleSlug],
      };
    });
  };

  const isModuleComplete = (courseId: string, moduleSlug: string) => {
    return progress[courseId]?.includes(moduleSlug) || false;
  };

  const getCompletedCount = (courseId: string) => {
    return progress[courseId]?.length || 0;
  };

  const isCourseComplete = (courseId: string, totalModules: number) => {
    return getCompletedCount(courseId) >= totalModules;
  };

  return {
    progress,
    isLoaded,
    markAsComplete,
    isModuleComplete,
    getCompletedCount,
    isCourseComplete,
  };
}
