import { Heading, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import OrderForm from "../../components/forms/orderForm";

export default function CloseOrder() {
  const token = useSelector((state) => state.userReducer.token);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams(); //params.id => orderid
  const orders = useSelector((state) => state.orderReducer.orders);
  const orderToClose = orders.find((order) => order._id === params.id);

  const handleCloseOrder = async (orderData) => {
    try {
      setIsLoading(true);
      const resp = await api.epCloseOrder(orderData, params.id, token);
      if (resp.status === 200) {
        const { closedOrder, removedProductIds } = resp.data;
        dispatch({ type: "CLOSE_ORDER", payload: closedOrder });
        dispatch({ type: "UPDATE_PRODUCTS", payload: { removedProductIds } }); //update products to available true
        alert("ההזמנה נסגרה!");
        navigate("/closedOrders");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack gap="20px">
      <Heading as="h1" variant={"h1"}>
        סגירת הזמנה
      </Heading>
      <OrderForm
        initialData={orderToClose}
        onSubmit={handleCloseOrder}
        isLoading={isLoading}
        isCloseForm={true}
      />
    </VStack>
  );
}
