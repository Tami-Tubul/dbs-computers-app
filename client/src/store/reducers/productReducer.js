export const productReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case "GET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
      };

    case "UPDATE_PRODUCTS": {
      const { addedProductIds = [], removedProductIds = [] } = action.payload;

      const updatedProducts = state.products.map((category) => ({
        ...category,
        list: category.list.map((product) => {
          if (removedProductIds.includes(product._id)) {
            return { ...product, available: true };
          }
          if (addedProductIds.includes(product._id)) {
            return { ...product, available: false };
          }
          return product;
        }),
      }));

      return {
        ...state,
        products: updatedProducts,
      };
    }
    default:
      return state;
  }
};
