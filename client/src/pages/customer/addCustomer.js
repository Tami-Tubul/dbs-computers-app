import { Heading, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import CustomerForm from "../../components/forms/customerForm";

export default function AddCustomer() {
  const token = useSelector((state) => state.userReducer.token);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddCustomer = async (customerData) => {
    try {
      setIsLoading(true);
      const resp = await api.epAddCustomer(customerData, token);
      if (resp.status === 201) {
        dispatch({ type: "ADD_CUSTOMER", payload: resp.data });
        alert("הלקוח נוסף בהצלחה");
        navigate("/customers");
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
        הוספת לקוח חדש
      </Heading>
      <CustomerForm isLoading={isLoading} onSubmit={handleAddCustomer} />
    </VStack>
  );
}
