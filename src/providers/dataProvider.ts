import { BACKEND_BASE_URL } from "@/constants";
import { DataProvider } from "@refinedev/core";
import axios from "axios";



const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination }) => {
    const {  pageSize = 10 } = pagination ?? {};

    const response = await apiClient.get(`/${resource}`, {
      params: { _page: 1, _limit: pageSize },
    });

    const total = response.headers["x-total-count"] ?? response.data.length;

    return {success: true, data: response.data, total };
  },

  getOne: async ({ resource, id }) => {
    const response = await apiClient.get(`/${resource}/${id}`);
    return {success: true, data: response.data };
  },

  create: async ({ resource, variables }) => {
    const response = await apiClient.post(`/${resource}`, variables);
    return { success: true, data: response.data };
  },

  update: async ({ resource, id, variables }) => {
    const response = await apiClient.put(`/${resource}/${id}`, variables);
    localStorage.setItem('user', JSON.stringify(response.data[0]));
    return { success: true, data: response.data[0] };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await apiClient.delete(`/${resource}/${id}`);
    return { success: true, data: response.data };
  },
  getApiUrl: function (): string {
    throw new Error("Function not implemented.");
  }
};
