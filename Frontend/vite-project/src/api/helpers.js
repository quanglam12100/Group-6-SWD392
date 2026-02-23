import axiosClient from "./axiosClient";

// Helper để check API connection
export const checkApiConnection = async () => {
  try {
    const response = await axiosClient.get("/test/connection");
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Helper để handle image upload
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const response = await axiosClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, url: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Helper để format error message
export const getErrorMessage = (error) => {
  if (typeof error === "string") {
    return error;
  }
  if (error?.message) {
    return error.message;
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return "Đã xảy ra lỗi";
};

// Helper để validate data trước khi gửi API
export const validators = {
  required: (value, fieldName) => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return `${fieldName} không được để trống`;
    }
    return null;
  },

  minLength: (value, min, fieldName) => {
    if (value && value.length < min) {
      return `${fieldName} phải có ít nhất ${min} ký tự`;
    }
    return null;
  },

  maxLength: (value, max, fieldName) => {
    if (value && value.length > max) {
      return `${fieldName} không được quá ${max} ký tự`;
    }
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return "Email không hợp lệ";
    }
    return null;
  },

  username: (value) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (value && !usernameRegex.test(value)) {
      return "Username chỉ được chứa chữ cái, số và dấu gạch dưới";
    }
    return null;
  },

  number: (value, fieldName) => {
    if (value && isNaN(Number(value))) {
      return `${fieldName} phải là số`;
    }
    return null;
  },

  positive: (value, fieldName) => {
    if (value && Number(value) <= 0) {
      return `${fieldName} phải lớn hơn 0`;
    }
    return null;
  },
};

// Helper để validate form data
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = data[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
