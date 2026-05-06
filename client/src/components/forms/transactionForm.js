import {
  HStack,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Box,
  Stack,
  Select,
  Spinner,
  Textarea,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";
import { toInputDateFormat } from "../../utils/formatDate";
import { useSelector } from "react-redux";

export default function TransactionForm({
  initialData = {},
  onSubmit,
  isLoading,
  isEditForm,
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
    setValue,
  } = useForm();

  const transactionTypeWatch = watch("transactionType");
  const transactionNameWatch = watch("transactionName");

  const users = useSelector((state) => state.userReducer.users);
  const currentUser = useSelector((state) => state.userReducer);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (currentUser.role !== "admin") {
      // set value to disabled createdBy field for non-admin users
      setValue("createdBy", currentUser.userId);
    }
  }, [currentUser, setValue]);

  return (
    <>
      {isEditForm && _.isEmpty(initialData) ? (
        <Box h={"100%"} mt="150px">
          <Spinner />
        </Box>
      ) : (
        <Box
          as="form"
          p="20px"
          background={"primary.fillColor"}
          boxShadow="0px 2px 20px 0px #00000014"
          borderRadius="20px"
          textAlign="center"
          maxW="1000px"
          w="100%"
          onSubmit={handleSubmit(onSubmit)}
        >
          <HStack
            gap="20px"
            justifyContent={"center"}
            flexWrap={"wrap"}
            p="20px"
          >
            <Stack alignItems="flex-start" gap="22px">
              <FormControl isInvalid={!!errors.transactionName}>
                <FormLabel>שם הפעולה:</FormLabel>
                <Select
                  defaultValue={initialData.transactionName}
                  placeholder="שם הפעולה"
                  aria-label="שם הפעולה"
                  {...register(`transactionName`, { required: "שדה חובה" })}
                >
                  {["הכנסה", "הוצאה"]?.map((tname, idx) => {
                    return (
                      <option key={idx} value={tname}>
                        {tname}
                      </option>
                    );
                  })}
                </Select>
                {errors.transactionName && (
                  <FormErrorMessage color="primary.error">
                    {errors.transactionName.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.transactionType}>
                <FormLabel>סוג הפעולה:</FormLabel>
                <Select
                  defaultValue={initialData.transactionType}
                  placeholder="סוג הפעולה"
                  aria-label="סוג הפעולה"
                  {...register(`transactionType`, { required: "שדה חובה" })}
                >
                  {["רגילה", "קבועה"]?.map((category, idx) => {
                    return (
                      <option key={idx} value={category}>
                        {category}
                      </option>
                    );
                  })}
                </Select>
                {errors.transactionType && (
                  <FormErrorMessage color="primary.error">
                    {errors.transactionType.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.amount}>
                <FormLabel>סכום:</FormLabel>
                <Input
                  type="number"
                  defaultValue={initialData.amount || ""}
                  placeholder="סכום"
                  aria-label="סכום"
                  {...register("amount", { required: "שדה חובה" })}
                />
                {errors.amount && (
                  <FormErrorMessage color="primary.error">
                    {errors.amount.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>תיאור:</FormLabel>
                <Textarea
                  defaultValue={initialData.description || ""}
                  placeholder="תיאור"
                  aria-label="תיאור"
                  {...register("description", { required: "שדה חובה" })}
                />
                {errors.description && (
                  <FormErrorMessage color="primary.error">
                    {errors.description.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.createdBy}>
                <FormLabel>נוצר על ידי:</FormLabel>
                <Select
                  placeholder="נוצר על ידי"
                  {...register("createdBy", { required: "שדה חובה" })}
                  defaultValue={
                    initialData.createdBy?._id || currentUser.userId
                  } // default to current user if not specified
                  isDisabled={currentUser.role !== "admin"} // non-admin users cannot change this field
                >
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.nickName}
                    </option>
                  ))}
                </Select>
                {errors.createdBy && (
                  <FormErrorMessage color="primary.error">
                    {errors.createdBy.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.transactionDate}>
                <FormLabel>תאריך:</FormLabel>
                <Input
                  type="date"
                  defaultValue={
                    initialData.transactionDate
                      ? toInputDateFormat(new Date(initialData.transactionDate))
                      : toInputDateFormat(new Date())
                  }
                  placeholder="תאריך"
                  aria-label="תאריך"
                  {...register("transactionDate", { required: "שדה חובה" })}
                />
                {errors.transactionDate && (
                  <FormErrorMessage color="primary.error">
                    {errors.transactionDate.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              {transactionTypeWatch === "קבועה" && (
                <FormControl isInvalid={!!errors.fixedTransactionEndDate}>
                  <FormLabel>{`תאריך סיום ${
                    transactionNameWatch ? transactionNameWatch : "הוצאה/הכנסה"
                  } קבועה:`}</FormLabel>
                  <Input
                    type="date"
                    defaultValue={
                      initialData.fixedTransactionEndDate
                        ? toInputDateFormat(
                            new Date(initialData.fixedTransactionEndDate),
                          )
                        : toInputDateFormat(
                            new Date(
                              initialData.transactionDate
                                ? new Date(
                                    initialData.transactionDate,
                                  ).getFullYear()
                                : new Date().getFullYear(),
                              11,
                              31,
                            ),
                          )
                    }
                    placeholder="תאריך סיום"
                    aria-label="תאריך סיום"
                    {...register("fixedTransactionEndDate", {
                      required: "שדה חובה",
                    })}
                  />
                  {errors.fixedTransactionEndDate && (
                    <FormErrorMessage color="primary.error">
                      {errors.fixedTransactionEndDate.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              )}
            </Stack>
          </HStack>
          <Button
            type="submit"
            variant="primary"
            mt="24px"
            isDisabled={isEditForm && !isDirty}
            isLoading={isLoading}
          >
            שמירה
          </Button>
        </Box>
      )}
    </>
  );
}
