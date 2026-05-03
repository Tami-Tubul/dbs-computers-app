import {
  Heading,
  HStack,
  Text,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Box,
  Stack,
  Select,
  Spinner,
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  ModalHeader,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import api from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  hebrewDateFormat,
  toInputDateTimeFormat,
} from "../../utils/formatDate";
import _ from "lodash";
import CustomSelect from "../customSelect";
import CustomerForm from "./customerForm";

export default function OrderForm({
  initialData = {},
  onSubmit,
  isLoading,
  isEditForm,
  isCloseForm,
  isEditClosedForm,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
    control,
    setValue,
  } = useForm({
    defaultValues: {
      products: initialData.products || [
        {
          uuid: uuidv4(),
          product: { _id: null, category: "" },
          rentedAsAdvanced: false,
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const orderDate = watch("orderDate");
  const closeDate = watch("closeDate");

  const deliveryEnabled = watch("delivery.enabled");
  const goEnabled = watch("delivery.go.enabled");
  const backEnabled = watch("delivery.back.enabled");
  const isDeliveryInvalid = deliveryEnabled && !goEnabled && !backEnabled;

  const [categories, setCategories] = useState(null);
  const products = useSelector((state) => state.productReducer.products);
  const customers = useSelector((state) => state.customerReducer.customers);
  const [productCategories, setProductCategories] = useState({});
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const token = useSelector((state) => state.userReducer.token);
  const dispatch = useDispatch();

  const handleCategoryChange = (index, category) => {
    setValue(`products.${index}.product.category`, category, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`products.${index}.product._id`, null, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setProductCategories((prev) => ({ ...prev, [index]: category }));
  };

  const handleRemove = (index) => {
    remove(index);
    setProductCategories((prevCategories) => ({
      ...prevCategories,
      [index]: undefined, // Remove the category for the removed product
    }));
  };

  const handleFormSubmit = async (formData) => {
    // const productsIds = formData.products.map(p => p._id);
    // const uniqueProductIds = [...new Set(productsIds)]; // remove duplicates products
    const productsForServer = formData.products
      .map((p) => ({
        product: p.product?._id,
        rentedAsAdvanced: !!p.rentedAsAdvanced,
      }))
      .filter((p) => p.product);
    const orderData = {
      ...formData,
      products: productsForServer,
      customer: formData.customer.value,
    };
    onSubmit(orderData);
  };

  const handleAddCustomer = async (customerData) => {
    try {
      setIsLoadingModal(true);
      const resp = await api.epAddCustomer(customerData, token);
      if (resp.status === 201) {
        dispatch({ type: "ADD_CUSTOMER", payload: resp.data });
        setValue("customer", {
          value: resp.data._id,
          label: `${customerData.firstname} ${customerData.lastname} ${customerData.phone}`,
        });
        onClose(); //close addCcustomer modal
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 400) alert(error.response.data.message);
    } finally {
      setIsLoadingModal(false);
    }
  };

  useEffect(() => {
    reset();
  }, []);

  // Fetch categories and initialize form
  useEffect(() => {
    const getCategories = async () => {
      try {
        const resp = await api.epGetCategories(token);
        if (resp.status === 200) {
          setCategories(resp.data.categories);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
  }, [token]);

  // Update form values when initialData changes
  useEffect(() => {
    if (Object.keys(initialData).length > 0 && categories) {
      reset({
        ...initialData,
        orderDate: initialData.orderDate
          ? toInputDateTimeFormat(initialData.orderDate)
          : toInputDateTimeFormat(new Date()),
        closeDate: isEditClosedForm
          ? toInputDateTimeFormat(initialData.closeDate)
          : toInputDateTimeFormat(new Date()),
        products:
          initialData.products.length > 0
            ? initialData.products
            : [
                {
                  uuid: uuidv4(),
                  product: { _id: null, category: "" },
                  rentedAsAdvanced: false,
                },
              ],
      });
    }
  }, [initialData, reset, categories]);

  return (
    <>
      {(isEditForm || isCloseForm) && _.isEmpty(initialData) ? (
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
          maxW="1400px"
          minH={"460px"}
          w="100%"
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          textAlign="center"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <HStack
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            flexWrap={"wrap"}
            p="20px"
          >
            <Stack
              alignItems="flex-start"
              gap="22px"
              role="group"
              aria-label="פרטי לקוח"
            >
              <Heading as="h2" variant={"h2"}>
                פרטי לקוח
              </Heading>
              <FormControl isInvalid={!!errors.customer}>
                <Controller
                  name="customer"
                  control={control}
                  defaultValue={
                    initialData.customer?._id
                      ? {
                          value: initialData.customer._id,
                          label: `${initialData.customer.firstname} ${initialData.customer.lastname} ${initialData.customer.phone}`,
                        }
                      : null
                  }
                  rules={{ required: "שדה חובה" }}
                  render={({ field }) => {
                    const selectedCustomer = customers.find(
                      (c) =>
                        c._id === field.value?._id ||
                        c._id === field.value?.value,
                    );
                    return (
                      <CustomSelect
                        {...field}
                        ref={field.ref}
                        placeholder="בחר לקוח"
                        aria-label="בחר לקוח"
                        isDisabled={isCloseForm}
                        options={customers.map((c) => ({
                          value: c._id,
                          label: `${c.firstname} ${c.lastname} ${c.phone}`,
                        }))}
                        value={
                          selectedCustomer
                            ? {
                                value: selectedCustomer._id,
                                label: `${selectedCustomer.firstname} ${selectedCustomer.lastname} ${selectedCustomer.phone}`,
                              }
                            : null
                        }
                      />
                    );
                  }}
                />
                {errors.customer && (
                  <FormErrorMessage color="primary.error">
                    {errors.customer.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <HStack>
                <Text variant={"runningText"}>לקוח חדש?</Text>
                <Button
                  variant={"primary"}
                  p="16px"
                  onClick={onOpen}
                  isDisabled={isCloseForm}
                >
                  הוסף לקוח
                </Button>
              </HStack>
            </Stack>

            <Stack
              position={"relative"}
              alignItems="flex-start"
              gap="22px"
              role="group"
              aria-label="פרטי מוצרים"
            >
              <Heading as="h2" variant={"h2"}>
                פרטי מוצרים
              </Heading>
              {/* {fields.length < 4 && ( */}
              <Button
                variant={"primary"}
                p="5px"
                h="30px"
                minW="30px"
                position={"absolute"}
                right={0}
                isDisabled={isCloseForm}
                onClick={() =>
                  append({
                    uuid: uuidv4(),
                    product: { _id: null, category: "" },
                    rentedAsAdvanced: false,
                  })
                }
              >
                +
              </Button>
              {/* )} */}
              {fields.map((field, index) => {
                return (
                  <HStack
                    key={`${field.product?._id || field.uuid}-${index}`}
                    alignItems="center"
                  >
                    <FormControl
                      isInvalid={!!errors.products?.[index]?.product?.category}
                    >
                      <Select
                        defaultValue={field.product?.category}
                        placeholder="סוג מוצר"
                        aria-label="סוג מוצר"
                        {...register(`products.${index}.product.category`, {
                          required: "שדה חובה",
                        })}
                        onChange={(e) =>
                          handleCategoryChange(index, e.target.value)
                        }
                        isDisabled={isCloseForm}
                      >
                        {categories?.map((category, idx) => {
                          return (
                            <option key={idx} value={category}>
                              {category}
                            </option>
                          );
                        })}
                      </Select>
                      {errors.products?.[index]?.product?.category && (
                        <FormErrorMessage color="primary.error">
                          {errors.products[index].product.category.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.products?.[index]?._id}>
                      <Select
                        defaultValue={field.product?._id}
                        placeholder="שם מוצר"
                        aria-label="שם מוצר"
                        {...register(`products.${index}.product._id`, {
                          required: "שדה חובה",
                        })}
                        onChange={(e) =>
                          setValue(
                            `products.${index}.product._id`,
                            e.target.value,
                            { shouldDirty: true, shouldValidate: true },
                          )
                        }
                        isDisabled={isCloseForm}
                      >
                        {products
                          .find(
                            (p) =>
                              p.category ===
                              (productCategories[index] ||
                                field.product?.category),
                          )
                          ?.list.map((product) => {
                            return (
                              <option
                                key={product._id}
                                value={product._id}
                                disabled={
                                  !product.available &&
                                  !initialData?.products?.some(
                                    (p) => p.product?._id === product._id,
                                  )
                                    ? true
                                    : false
                                }
                              >
                                {product.productName}
                                {product.computerDetails?.isAdvanced && " ⭐"}
                              </option>
                            );
                          })}
                      </Select>
                      {errors.products?.[index]?.product?._id && (
                        <FormErrorMessage color="primary.error">
                          {errors.products[index].product._id.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl>
                      {(() => {
                        const selectedProductId = watch(
                          `products.${index}.product._id`,
                        );
                        const selectedProduct = products
                          .find(
                            (p) =>
                              p.category ===
                              (productCategories[index] ||
                                field.product?.category),
                          )
                          ?.list.find((p) => p._id === selectedProductId);

                        return selectedProduct?.computerDetails?.isAdvanced ? (
                          <Checkbox
                            variant={"goldCb"}
                            {...register(`products.${index}.rentedAsAdvanced`)}
                            defaultChecked={field.rentedAsAdvanced || false}
                            isDisabled={isCloseForm}
                          >
                            מושכר כמתקדם
                          </Checkbox>
                        ) : null;
                      })()}
                    </FormControl>
                    {index > 0 && (
                      <Button
                        variant={"primary"}
                        p="5px"
                        h="30px"
                        minW="30px"
                        isDisabled={isCloseForm}
                        onClick={() => handleRemove(index)}
                      >
                        -
                      </Button>
                    )}
                  </HStack>
                );
              })}
              <HStack
                maxW="210px"
                w="100%"
                justifyContent="space-between"
                px="16px"
              >
                <Text variant={"runningText"}>מס' עכברים:</Text>
                <Controller
                  name="mouseQuantity"
                  control={control}
                  defaultValue={initialData.mouseQuantity || 0}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      size="sm"
                      maxW={20}
                      min={0}
                      max={20}
                      onChange={(valueString, valueNumber) =>
                        field.onChange(valueNumber)
                      }
                      isDisabled={isCloseForm}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
              </HStack>
            </Stack>

            <Stack
              alignItems="flex-start"
              gap="22px"
              role="group"
              aria-label="פרטי הזמנה"
            >
              <Heading as="h2" variant={"h2"}>
                פרטי הזמנה
              </Heading>
              <FormControl isInvalid={!!errors.orderDate}>
                <Input
                  type="datetime-local"
                  defaultValue={toInputDateTimeFormat(new Date())}
                  placeholder="תאריך הזמנה"
                  aria-label="תאריך הזמנה"
                  {...register("orderDate", { required: "שדה חובה" })}
                  isDisabled={isCloseForm}
                />
                {errors.orderDate && (
                  <FormErrorMessage color="primary.error">
                    {errors.orderDate.message}
                  </FormErrorMessage>
                )}
                {isCloseForm && (
                  <FormHelperText color={"primary.dbsBlue"} textAlign={"left"}>
                    {hebrewDateFormat(new Date(orderDate))}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.orderPrice}>
                <Input
                  type="number"
                  defaultValue={Number(initialData.orderPrice || null)}
                  placeholder="הסכום ששולם"
                  aria-label="הסכום ששולם"
                  {...register("orderPrice")}
                />
                {errors.orderPrice && (
                  <FormErrorMessage color="primary.error">
                    {errors.orderPrice.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <Stack spacing={4}>
                <FormControl isInvalid={!!isDeliveryInvalid}>
                  <Checkbox
                    {...register("delivery.enabled")}
                    defaultValue={false}
                    isChecked={deliveryEnabled}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setValue("delivery.enabled", checked, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      if (!checked) {
                        setValue("delivery.go.enabled", false, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("delivery.go.payment", false, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("delivery.back.enabled", false, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("delivery.back.payment", false, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    משלוח
                  </Checkbox>
                  {isDeliveryInvalid && (
                    <FormErrorMessage color="primary.error">
                      יש לבחור לפחות כיוון אחד
                    </FormErrorMessage>
                  )}
                </FormControl>

                {/* --- הלוך / חזור --- */}
                {deliveryEnabled && (
                  <Stack pl={6} spacing={4}>
                    {/* הלוך */}
                    <HStack justify="space-between">
                      <Checkbox
                        {...register("delivery.go.enabled")}
                        isChecked={goEnabled}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setValue("delivery.go.enabled", checked, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          if (!checked)
                            setValue("delivery.go.payment", false, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                        }}
                      >
                        הלוך
                      </Checkbox>
                      <Select
                        {...register("delivery.go.payment")}
                        width="140px"
                        defaultValue={false}
                        isDisabled={!goEnabled}
                      >
                        <option value={true}>שולם</option>
                        <option value={false}>לא שולם</option>
                      </Select>
                    </HStack>

                    {/* חזור */}
                    <HStack justify="space-between">
                      <Checkbox
                        {...register("delivery.back.enabled")}
                        isChecked={backEnabled}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setValue("delivery.back.enabled", checked, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          if (!checked)
                            setValue("delivery.back.payment", false, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                        }}
                      >
                        חזור
                      </Checkbox>
                      <Select
                        {...register("delivery.back.payment")}
                        width="140px"
                        defaultValue={false}
                        isDisabled={!backEnabled}
                      >
                        <option value={true}>שולם</option>
                        <option value={false}>לא שולם</option>
                      </Select>
                    </HStack>
                  </Stack>
                )}
              </Stack>
              {isCloseForm && (
                <>
                  <FormControl isInvalid={!!errors.closeDate}>
                    <Input
                      type="datetime-local"
                      defaultValue={toInputDateTimeFormat(new Date())}
                      placeholder="תאריך סיום הזמנה"
                      aria-label="תאריך סיום הזמנה"
                      {...register("closeDate", { required: "שדה חובה" })}
                      isDisabled={isEditClosedForm}
                    />
                    {errors.closeDate && (
                      <FormErrorMessage color="primary.error">
                        {errors.closeDate.message}
                      </FormErrorMessage>
                    )}
                    {isCloseForm && (
                      <FormHelperText
                        color={"primary.dbsBlue"}
                        textAlign={"left"}
                      >
                        {hebrewDateFormat(new Date(closeDate))}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.remainingPrice}>
                    <Input
                      type="number"
                      defaultValue={Number(initialData.remainingPrice || null)}
                      placeholder="הסכום שנותר לתשלום"
                      aria-label="הסכום שנותר לתשלום"
                      {...register("remainingPrice")}
                    />
                    {errors.remainingPrice && (
                      <FormErrorMessage color="primary.error">
                        {errors.remainingPrice.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </>
              )}
            </Stack>
          </HStack>
          <Button
            type="submit"
            variant="primary"
            alignSelf={"center"}
            isDisabled={
              ((isEditClosedForm || isEditForm) && !isDirty) ||
              isDeliveryInvalid
            }
            isLoading={isLoading}
          >
            שמירה
          </Button>
        </Box>
      )}

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader as="h2">הוספת לקוח</ModalHeader>
          <ModalCloseButton aria-label="סגור חלון" />
          <ModalBody>
            <CustomerForm
              onSubmit={handleAddCustomer}
              isLoading={isLoadingModal}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
