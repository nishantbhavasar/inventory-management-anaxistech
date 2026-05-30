import axios, { type AxiosRequestConfig, type AxiosResponse, type Method } from "axios";
import config from "../config/config";

export interface RequestData<T = any> {
  params?: Record<string, any>;
  data?: T | Record<string, any> | any;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  status: number;
  success: boolean;
  data: T;
  message: string;
}

export default class API {
  private baseUrl = config.API_PATH;

  public async api<T>(
    method: Method,
    url: string,
    data?: RequestData,
  ): Promise<ApiResponse<T>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        method,
        url: `${this.baseUrl}${url}`,
        headers: this.setHeaders(data),
        params: data?.params,
        data: data?.data,
      };
      const response: AxiosResponse<ApiResponse<T>> = await axios(axiosConfig);

      return response.data;
    } catch (error: any) {
      console.log({ error });
      return Promise.resolve(error?.response?.data);
    }
  }

  public get<T>(url: string, data?: RequestData): Promise<ApiResponse<T>> {
    return this.api<T>("GET", url, data);
  }

  public post<T>(url: string, data?: RequestData): Promise<ApiResponse<T>> {
    return this.api<T>("POST", url, data);
  }

  public put<T>(url: string, data?: RequestData): Promise<ApiResponse<T>> {
    return this.api<T>("PUT", url, data);
  }

  public delete<T>(url: string, data?: RequestData): Promise<ApiResponse<T>> {
    return this.api<T>("DELETE", url, data);
  }

  private setHeaders(data?: RequestData): Record<string, string> {
    const headers: Record<string, string> = {
      "accept-language": "en",
      "Content-Type": "application/json",
    };

    if (data?.headers) {
      Object.assign(headers, data.headers);
    }

    return headers;
  }
}
