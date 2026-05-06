import { Heading, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import OrderForm from "../../components/forms/orderForm";

export default function EditOrder() {
  const token = useSelector((state) => state.userReducer.token);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams(); //params.id => orderid
  const orders = useSelector((state) => state.orderReducer.orders);
  const orderToEdit = orders.find((order) => order._id === params.id);

  const handleEditOrder = async (orderData) => {
    try {
      setIsLoading(true);
      const resp = await api.epEditOrder(orderData, params.id, token);
      if (resp.status === 200) {
        const { updatedOrder, addedProductIds, removedProductIds } = resp.data;
        dispatch({ type: "EDIT_ORDER", payload: updatedOrder });
        dispatch({
          type: "UPDATE_PRODUCTS",
          payload: {
            addedProductIds,
            removedProductIds,
            orderId: updatedOrder._id,
          },
        }); //update products to available true/false
        alert("ההזמנה עודכנה בהצלחה");
        navigate("/openOrders");
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
        עריכת הזמנה
      </Heading>
      <OrderForm
        initialData={orderToEdit}
        onSubmit={handleEditOrder}
        isLoading={isLoading}
        isEditForm={true}
      />
    </VStack>
  );
}
