import naturalCompare from "./naturalCompare";

export const customProductSort = (a, b) => {
  const productA = a.original.products[0]?.product?.productName || "";
  const productB = b.original.products[0]?.product?.productName || "";
  return naturalCompare(productA, productB);
};
