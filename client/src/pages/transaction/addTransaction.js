import { Heading, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import TransactionForm from "./../../components/forms/transactionForm";

export default function AddTransaction() {
  const token = useSelector((state) => state.userReducer.token);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddTransaction = async (transactionData) => {
    try {
      setIsLoading(true);
      const resp = await api.epAddTransaction(transactionData, token);
      if (resp.status === 201) {
        dispatch({ type: "ADD_TRANSACTION", payload: resp.data });
        alert("הפעולה נוספה בהצלחה");
        navigate("/transactions");
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
        הוספת פעולה חדשה
      </Heading>
      <TransactionForm isLoading={isLoading} onSubmit={handleAddTransaction} />
    </VStack>
  );
}
