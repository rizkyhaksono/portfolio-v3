/**
 * Custom React Hooks for Admin API Services
 * Makes it easier to use admin services in React components
 */

"use client";
import { useState, useEffect, useCallback } from "react";
import type {
  ProjectModel,
  WorkModel,
  EducationModel,
  UserModel,
  PublicChatMessage,
} from "@/commons/types/admin";
import * as adminServices from "@/services/admin";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  refresh: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

/**
 * Hook for fetching projects with pagination
 */
export function useProjects(initialPage = 1, limit = 10): UseListState<ProjectModel> {
  const [data, setData] = useState<ProjectModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminServices.getAllProjects({ page, limit });
      setData(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    total,
    refresh: fetchData,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    goToPage: setPage,
  };
}

/**
 * Hook for fetching work experiences with pagination
 */
export function useWorkExperiences(initialPage = 1, limit = 10): UseListState<WorkModel> {
  const [data, setData] = useState<WorkModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminServices.getAllWork({ page, limit });
      setData(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch work experiences");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    total,
    refresh: fetchData,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    goToPage: setPage,
  };
}

/**
 * Hook for fetching education records with pagination
 */
export function useEducation(initialPage = 1, limit = 10): UseListState<EducationModel> {
  const [data, setData] = useState<EducationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminServices.getAllEducation({ page, limit });
      setData(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch education records");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    total,
    refresh: fetchData,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    goToPage: setPage,
  };
}

/**
 * Hook for fetching current user
 */
export function useCurrentUser(): UseApiState<UserModel> {
  const [data, setData] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminServices.getCurrentUser();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}

/**
 * Hook for public chat messages with cursor-based pagination
 */
export function usePublicChat(limit = 20) {
  const [data, setData] = useState<PublicChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);

  const fetchData = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminServices.getAllPublicChatMessages(
        reset ? undefined : cursor,
        limit
      );
      
      if (reset) {
        setData(response.data);
      } else {
        setData((prev) => [...prev, ...response.data]);
      }
      
      setCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [cursor, limit]);

  useEffect(() => {
    fetchData(true);
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    refresh: () => fetchData(true),
    loadMore: () => fetchData(false),
  };
}

/**
 * Hook for AI chat history
 */
export function useAIChatHistory() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminServices.getAIChatHistory();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch chat history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}

/**
 * Generic mutation hook for create/update/delete operations
 */
export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = useCallback(
    async (params: P) => {
      try {
        setLoading(true);
        setError(null);
        const result = await mutationFn(params);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Mutation failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn]
  );

  return {
    mutate,
    loading,
    error,
    data,
    reset: () => {
      setData(null);
      setError(null);
    },
  };
}

/**
 * Hook for file upload
 */
export function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      
      // Simulate progress (since fetch doesn't provide upload progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await adminServices.uploadFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    upload,
    loading,
    error,
    progress,
  };
}

/**
 * Example usage of hooks:
 * 
 * // In a component:
 * const { data: projects, loading, error, nextPage, prevPage } = useProjects(1, 10);
 * const { data: user } = useCurrentUser();
 * const createProjectMutation = useMutation(adminServices.createProject);
 * const { upload, progress } = useFileUpload();
 * 
 * // Create project
 * await createProjectMutation.mutate(projectData);
 * 
 * // Upload file
 * await upload(file);
 */
