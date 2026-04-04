import { Heading, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import OrderForm from "../../components/forms/orderForm";

export default function EditClosedOrder() {
  const token = useSelector((state) => state.userReducer.token);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams(); //params.id => orderid
  const orders = useSelector((state) => state.orderReducer.orders);
  const orderToEdit = orders.find((order) => order._id === params.id);

  const handleEditClosedOrder = async (orderData) => {
    try {
      setIsLoading(true);
      const resp = await api.epEditClosedOrder(orderData, params.id, token);
      if (resp.status === 200) {
        dispatch({ type: "EDIT_CLOSED_ORDER", payload: resp.data });
        alert("ההזמנה עודכנה בהצלחה");
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
        עריכת הזמנה סגורה
      </Heading>
      <OrderForm
        initialData={orderToEdit}
        onSubmit={handleEditClosedOrder}
        isLoading={isLoading}
        isCloseForm={true}
        isEditClosedForm={true}
      />
    </VStack>
  );
}
