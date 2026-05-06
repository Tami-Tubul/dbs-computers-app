import { Heading, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import ProductForm from "../../components/forms/productForm";

export default function AddProduct() {
  const token = useSelector((state) => state.userReducer.token);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddProduct = async (productData) => {
    try {
      setIsLoading(true);
      const resp = await api.epAddProduct(productData, token);
      if (resp.status === 201) {
        dispatch({ type: "ADD_PRODUCT", payload: resp.data });
        alert("המוצר נוסף בהצלחה");
        navigate("/products");
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 400) alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack gap="20px">
      <Heading as="h1" variant={"h1"}>
        הוספת מוצר חדש
      </Heading>
      <ProductForm isLoading={isLoading} onSubmit={handleAddProduct} />
    </VStack>
  );
}
