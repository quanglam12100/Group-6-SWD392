// User Roles
export const USER_ROLES = {
  CUSTOMER: "customer",
  STAFF: "Staff",
  MANAGER: "Manager",
  CHEF: "Chef",
  ADMIN: "Admin",
};

// Table Status
export const TABLE_STATUS = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  RESERVED: "Reserved",
};

// Order Payment Status
export const PAYMENT_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};

// Order Payment Methods
export const PAYMENT_METHODS = {
  CASH: "Cash",
  CARD: "Card",
  TRANSFER: "Transfer",
};

// Order Detail Status
export const ORDER_DETAIL_STATUS = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  READY: "Ready",
  SERVED: "Served",
  CANCELLED: "Cancelled",
};

// API Base URL
export const API_BASE_URL = "https://localhost:7031/api";
