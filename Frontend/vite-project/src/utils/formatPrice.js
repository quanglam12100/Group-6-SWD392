export const formatPrice = (price) => {
  if (!price && price !== 0) return "0đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatNumber = (num) => {
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
};

export const parsePrice = (priceString) => {
  if (!priceString) return 0;
  return parseInt(priceString.toString().replace(/[^\d]/g, "")) || 0;
};
