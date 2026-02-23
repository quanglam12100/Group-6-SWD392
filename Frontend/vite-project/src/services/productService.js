import { api } from "./api";

export const productService = {
  // Products
  getAllProducts: async () => {
    return api.get("/products");
  },

  getProductById: async (id) => {
    return api.get(`/products/${id}`);
  },

  createProduct: async (productData) => {
    // productData: { categoryId, name, description, imageUrl, isActive }
    return api.post("/products", productData);
  },

  updateProduct: async (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return api.delete(`/products/${id}`);
  },

  // Product Keywords
  getProductKeywords: async (productId) => {
    return api.get(`/products/${productId}/keywords`);
  },

  addProductKeyword: async (productId, keyword) => {
    return api.post(`/products/${productId}/keywords`, { keyword });
  },

  // Categories
  getAllCategories: async () => {
    return api.get("/categories");
  },

  getCategoryById: async (id) => {
    return api.get(`/categories/${id}`);
  },

  createCategory: async (categoryData) => {
    // categoryData: { name }
    return api.post("/categories", categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return api.put(`/categories/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return api.delete(`/categories/${id}`);
  },

  // Variants (Product Variants)
  getAllVariants: async () => {
    return api.get("/variants");
  },

  getVariantsByProductId: async (productId) => {
    return api.get(`/variants/product/${productId}`);
  },

  getVariantById: async (id) => {
    return api.get(`/variants/${id}`);
  },

  createVariant: async (variantData) => {
    // variantData: { productId, sizeName, price }
    return api.post("/variants", variantData);
  },

  updateVariant: async (id, variantData) => {
    return api.put(`/variants/${id}`, variantData);
  },

  deleteVariant: async (id) => {
    return api.delete(`/variants/${id}`);
  },
};
