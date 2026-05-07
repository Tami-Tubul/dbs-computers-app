export const PRODUCT_STATUS = {
  ACTIVE: "פעיל",
  PAUSED: "מושהה",
  BROKEN: "תקול",
  SOLD: "נמכר",
};

export const getDisplayStatus = (product) => {
  if (product.status !== PRODUCT_STATUS.ACTIVE) return product.status; // "תקול" / "מושהה" / "נמכר"
  return product.available ? "פנוי" : "תפוס";
};

export const getProductStatusIcon = (product) => {
  if (!product?.available) {
    return { icon: "🔒", title: "תפוס" };
  }

  switch (product?.status) {
    case PRODUCT_STATUS.BROKEN:
      return { icon: "🛠️", title: "תקול" };

    case PRODUCT_STATUS.PAUSED:
      return { icon: "⏳", title: "מושהה" };

    default:
      return null;
  }
};
