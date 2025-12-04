import { BACKEND_BASE_URL } from "@/constants";
import { DataProvider } from "@refinedev/core";
import axios from "axios";

const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters }) => {
    const page = pagination?.currentPage ?? 1;
    const pageSize = pagination?.pageSize ?? 10;

    const params: Record<string, string | number> = {
      page,
      limit: pageSize
    };

    // Apply filters based on resource type
    filters?.forEach((filter) => {
      if ('field' in filter && 'value' in filter && filter.value) {
        const field = filter.field;
        const value = String(filter.value);

        if (resource === 'users') {
          if (field === 'role') params.roles = value;
          if (field === 'name') params.searchQuery = value;
        } 
        
        if (resource === 'subjects') {
          if (field === 'department') params.department = value;
          if (field === 'name') params.searchQuery = value;
        }
      }
    });

    const response = await apiClient.get(`/${resource}`, { params });

    // Extract data and total from response
    const data = response.data.data || response.data;
    const total = response.data.pagination?.total || data.length;

    return { success: true, data, total };
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
