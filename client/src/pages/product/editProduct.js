import { Heading, VStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import api from "../../services/api";
import ProductForm from "../../components/forms/productForm";

export default function EditProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.userReducer.token);
  const params = useParams(); //params.id => productid
  const products = useSelector((state) => state.productReducer.products);
  const productToEdit = products
    .flatMap((group) => group.list)
    .find((product) => product._id === params.id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditProduct = async (productData) => {
    try {
      setIsLoading(true);
      const resp = await api.epEditProduct(productData, params.id, token);
      if (resp.status === 200) {
        dispatch({ type: "EDIT_PRODUCT", payload: resp.data });
        alert("המוצר עודכן בהצלחה");
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
        עריכת מוצר
      </Heading>
      <ProductForm
        initialData={productToEdit}
        isEditForm={true}
        isLoading={isLoading}
        onSubmit={handleEditProduct}
      />
    </VStack>
  );
}
