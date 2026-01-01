// Asset/File Types
export interface UploadFileResponse {
  status: number;
  message: string;
  url: string;
  key: string;
}

export interface DownloadFileRequest {
  filename: string;
}

export interface DownloadFileResponse {
  status: number;
  url: string;
}
