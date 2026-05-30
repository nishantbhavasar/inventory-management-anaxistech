import API from "./Api";
import type { InventoryFormValues, InventoryItem, InventoryListData } from "../types/inventory";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface GetAllInventoriesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export default class InventoryApi {
  private api: API;

  private readonly API_ROUTES = {
    ITEMS: "items",
    ITEM: (id: string) => `items/${id}`,
  };

  constructor() {
    this.api = new API();
  }

  private handleResponse<T>(response: {
    success?: boolean;
    message?: string;
    data?: T;
  }): ApiResponse<T> {
    return {
      success: response?.success ?? false,
      message: response?.message ?? "Something went wrong",
      data: response?.success ? (response.data ?? null) : null,
    };
  }

  private handleError(error: unknown): ApiResponse<null> {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    };
  }

  private async request<T>(apiCall: () => Promise<unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await apiCall();
      return this.handleResponse<T>(response as { success?: boolean; message?: string; data?: T });
    } catch (error) {
      return this.handleError(error) as ApiResponse<T>;
    }
  }

  public getAllInventories(params: GetAllInventoriesParams) {
    const queryParams: Record<string, string | number> = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    };

    if (params.search?.trim()) {
      queryParams.search = params.search.trim();
    }

    return this.request<InventoryListData>(() =>
      this.api.get(this.API_ROUTES.ITEMS, { params: queryParams }),
    );
  }

  public getInventory(id: string) {
    return this.request<InventoryItem>(() =>
      this.api.get(this.API_ROUTES.ITEM(id)),
    );
  }

  public createInventory(data: InventoryFormValues) {
    return this.request<InventoryItem>(() =>
      this.api.post(this.API_ROUTES.ITEMS, { data }),
    );
  }

  public updateInventory(id: string, data: InventoryFormValues) {
    return this.request<{ updated: boolean }>(() =>
      this.api.put(this.API_ROUTES.ITEM(id), { data }),
    );
  }

  public deleteInventory(id: string) {
    return this.request<Record<string, never>>(() =>
      this.api.delete(this.API_ROUTES.ITEM(id)),
    );
  }
}
