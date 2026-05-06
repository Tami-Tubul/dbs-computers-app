import { Heading, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderForm from "../../components/forms/orderForm";
import api from "../../services/api";

export default function AddOrder() {
  const token = useSelector((state) => state.userReducer.token);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddOrder = async (orderData) => {
    try {
      setIsLoading(true);
      const resp = await api.epAddOrder(orderData, token);
      if (resp.status === 201) {
        const { newOrder, addedProductIds } = resp.data;
        dispatch({ type: "ADD_ORDER", payload: newOrder });
        dispatch({
          type: "UPDATE_PRODUCTS",
          payload: { addedProductIds, orderId: newOrder._id },
        }); //update order products to available false
        alert("ההזמנה נוספה בהצלחה");
        navigate("/openOrders");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        const unavailableProducts = error.response.data.unavailableProducts
          .map((prod) => prod.productName)
          .join(", ");
        alert("המוצרים: " + unavailableProducts + " תפוסים בהזמנה אחרת");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack gap="20px">
      <Heading as="h1" variant={"h1"}>
        יצירת הזמנה חדשה
      </Heading>
      <OrderForm onSubmit={handleAddOrder} isLoading={isLoading} />
    </VStack>
  );
}
