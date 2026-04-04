import { Heading, VStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import api from "../../services/api";
import TransactionForm from "../../components/forms/transactionForm";

export default function EditTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.userReducer.token);
  const params = useParams(); //params.id => transactionid
  const transactions = useSelector(
    (state) => state.transactionReducer.transactions
  );
  const transactionToEdit = transactions.find(
    (transaction) => transaction._id === params.id
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditTransaction = async (transactionData) => {
    try {
      setIsLoading(true);
      const resp = await api.epEditTransaction(
        transactionData,
        params.id,
        token
      );
      if (resp.status === 200) {
        dispatch({ type: "EDIT_TRANSACTION", payload: resp.data });
        alert("הפעולה עודכנה בהצלחה");
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
        עריכת פעולה
      </Heading>
      <TransactionForm
        initialData={transactionToEdit}
        isEditForm={true}
        isLoading={isLoading}
        onSubmit={handleEditTransaction}
      />
    </VStack>
  );
}
