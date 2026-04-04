import { Heading, VStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import api from "../../services/api";
import CustomerForm from "../../components/forms/customerForm";

export default function EditCustomer() {
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.userReducer.token);
  const params = useParams(); //params.id => customerid
  const customers = useSelector((state) => state.customerReducer.customers);
  const customerToEdit = customers.find(
    (customer) => customer._id === params.id
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditCustomer = async (customerData) => {
    try {
      setIsLoading(true);
      const resp = await api.epEditCustomer(customerData, params.id, token);
      if (resp.status === 200) {
        dispatch({ type: "EDIT_CUSTOMER", payload: resp.data });
        dispatch({ type: "UPDATE_ORDERS_WITH_CUSTOMER", payload: resp.data });
        alert("הלקוח עודכן בהצלחה");
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
        עריכת לקוח
      </Heading>
      <CustomerForm
        initialData={customerToEdit}
        isEditForm={true}
        isLoading={isLoading}
        onSubmit={handleEditCustomer}
      />
    </VStack>
  );
}
