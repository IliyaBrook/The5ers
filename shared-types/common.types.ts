export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface IUpload {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}
