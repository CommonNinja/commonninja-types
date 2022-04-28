export interface IApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}

export interface IApiPaginationResponse<T> {
  limit?: number;
  nextPage?: number | string | null;
  page?: number | string | null;
  pages?: number;
  prevPage?: number | string | null;
  total?: number;
  items: T[];
}