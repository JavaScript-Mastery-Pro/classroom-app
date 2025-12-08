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

        if (resource === 'classes') {
          if (field === 'subjectId') params.subjectId = value;
          if (field === 'teacherId') params.teacherId = value;
          if (field === 'name') params.searchQuery = value;
        }
      }
    });

    if (resource === 'classes') {
      console.log('Classes API - Params being sent:', params);
      console.log('Classes API - Filters:', filters);
    }

    const response = await apiClient.get(`/${resource}`, { params });

    // Extract data and total from response
    const data = response.data.data || response.data;
    const total = response.data.pagination?.total || data.length;

        console.log("Resource:", resource);
        console.log("Fetching list for user resource:", data);

    return { success: true, data, total };
  },

  update: async ({ resource, id, variables }) => {
    const response = await apiClient.put(`/${resource}/${id}`, variables);

    console.log("Resource:", resource);
    console.log(`Updating ${resource}:`, response.data);
    return { success: true, data: response.data[0] };
  },

  getOne: async ({ resource, id }) => {
    const response = await apiClient.get(`/${resource}/${id}`);

    console.log("Resource:", resource);
    console.log(`Fetching one for ${resource}:`, response.data);
    return {success: true, data: response.data[0] };
  },

  create: async ({ resource, variables }) => {
    const response = await apiClient.post(`/${resource}`, variables);

    console.log("Resource variables:", variables);
    console.log(`Creating new ${resource}:`, response.data);
    return { success: true, data: response.data[0], redirectTo: `/${resource}` };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await apiClient.delete(`/${resource}/${id}`);
    return { success: true, data: response.data };
  },

  custom: async ({ url }) => {
    const response = await apiClient.post(url);
    return { success: true, data: response.data };
  },

  getApiUrl: function (): string {
    throw new Error("Function not implemented.");
  }
};
