export const formatMoney = (value: number) =>
  `₦${Math.round(Number(value || 0)).toLocaleString("en-NG")}`;
