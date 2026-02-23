import { api } from "./api";

// Table status: Available, Occupied, Reserved
export const tableService = {
  getAllTables: async () => {
    return api.get("/tables");
  },

  getTableById: async (id) => {
    return api.get(`/tables/${id}`);
  },

  getAvailableTables: async () => {
    const tables = await api.get("/tables");
    return tables.filter(t => t.status === "Available");
  },

  createTable: async (tableData) => {
    // tableData: { name, status }
    return api.post("/tables", tableData);
  },

  updateTable: async (id, tableData) => {
    return api.put(`/tables/${id}`, tableData);
  },

  deleteTable: async (id) => {
    return api.delete(`/tables/${id}`);
  },

  updateTableStatus: async (id, status) => {
    // status: Available | Occupied | Reserved
    return api.put(`/tables/${id}/status`, { status });
  },
};
