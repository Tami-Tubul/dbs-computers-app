export const productReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case "GET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
      };

    case "ADD_PRODUCT": {
      const newProduct = action.payload;

      const updatedProducts = state.products.map((category) => {
        if (category.category === newProduct.category) {
          return {
            ...category,
            list: [...category.list, newProduct],
          };
        }
        return category;
      });

      return {
        ...state,
        products: updatedProducts,
      };
    }

    case "EDIT_PRODUCT": {
      const updatedProduct = action.payload;

      const updatedProducts = state.products.map((category) => ({
        ...category,
        list: category.list.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product,
        ),
      }));

      return {
        ...state,
        products: updatedProducts,
      };
    }

    case "DELETE_PRODUCT": {
      const productId = action.payload;

      const updatedProducts = state.products.map((category) => ({
        ...category,
        list: category.list.filter((product) => product._id !== productId),
      }));

      return {
        ...state,
        products: updatedProducts,
      };
    }

    case "UPDATE_PRODUCTS": {
      const {
        addedProductIds = [],
        removedProductIds = [],
        orderId,
      } = action.payload;

      const updatedProducts = state.products.map((category) => ({
        ...category,
        list: category.list.map((product) => {
          if (removedProductIds.includes(product._id)) {
            return { ...product, available: true, currentOrder: null };
          }
          if (addedProductIds.includes(product._id)) {
            return { ...product, available: false, currentOrder: orderId };
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
