import { BACKEND_BASE_URL } from "@/constants";
import { DataProvider } from "@refinedev/core";
import axios from "axios";

const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters }) => {
    const {  pageSize = 10 } = pagination ?? {};

    // Build query parameters
    const params: Record<string, string | number> = {
      _page: 1,
      _limit: pageSize
    };

    // Handle custom filters for users resource
    if (resource === 'users' && filters) {
      const roleFilters: string[] = [];
      let searchQuery = '';

      filters.forEach((filter) => {
        if ('field' in filter && 'value' in filter) {
          if (filter.field === 'role' && filter.value) {
            roleFilters.push(String(filter.value));
          }
          if (filter.field === 'name' && filter.value) {
            searchQuery = String(filter.value);
          }
        }
      });

      if (roleFilters.length > 0) {
        params.roles = roleFilters.join(',');
      }

      if (searchQuery) {
        params.searchQuery = searchQuery;
      }
    }

    const response = await apiClient.get(`/${resource}`, {
      params,
    });
    const total = response.headers["x-total-count"] ?? response.data.length;

    return {success: true, data: response.data , total };
  },

  update: async ({ resource, id, variables }) => {
    const response = await apiClient.put(`/${resource}/${id}`, variables);
    localStorage.setItem('user', JSON.stringify(response.data[0]));
    return { success: true, data: response.data[0] };
  },

  getOne: async ({ resource, id }) => {
    const response = await apiClient.get(`/${resource}/${id}`);
    return {success: true, data: response.data };
  },

  create: async ({ resource, variables }) => {
    const response = await apiClient.post(`/${resource}`, variables);
    return { success: true, data: response.data[0], redirectTo: `/${resource}` };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await apiClient.delete(`/${resource}/${id}`);
    return { success: true, data: response.data };
  },
  getApiUrl: function (): string {
    throw new Error("Function not implemented.");
  }
};
