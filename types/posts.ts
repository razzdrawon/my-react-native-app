export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: number;
}

export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
} 