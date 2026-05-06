import {
  HStack,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Box,
  Spinner,
  Textarea,
  Select,
  FormLabel,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";
import { useSelector } from "react-redux";
import api from "../../services/api";
import { reactSelectStyles } from "./../../theme/components/react-select";
import ReactSelect from "react-select";
import { toInputDateFormat } from "../../utils/formatDate";
import { softwareCategories } from "../../constants/softwareOptions";

export default function ProductForm({
  initialData = {},
  onSubmit,
  isLoading,
  isEditForm,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
    control,
    setValue,
  } = useForm({
    defaultValues: {
      status: "פעיל",
    },
  });

  const token = useSelector((state) => state.userReducer.token);
  const [categories, setCategories] = useState(null);

  const selectedCategory = watch("category");

  const flattenOptions = (groups) => groups.flatMap((group) => group.options);

  const isNetworkDevice =
    selectedCategory === "סטיקים" || selectedCategory === "ראוטרים";

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      const formattedData = {
        ...initialData,
        warranty: {
          ...initialData.warranty,
          startDate: initialData.warranty?.startDate
            ? toInputDateFormat(new Date(initialData.warranty.startDate))
            : "",
          endDate: initialData.warranty?.endDate
            ? toInputDateFormat(new Date(initialData.warranty.endDate))
            : "",
        },
        computerDetails: {
          ...initialData.computerDetails,
          checkDate: initialData.computerDetails?.checkDate
            ? toInputDateFormat(new Date(initialData.computerDetails.checkDate))
            : "",
        },
      };

      reset(formattedData);
    }
  }, [initialData, reset]);

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

  if (isEditForm && (_.isEmpty(initialData) || !categories)) {
    return (
      <Box h={"100%"} mt="150px" textAlign="center">
        <Spinner size="xl" />
        <Box mt={2}>טוען נתוני מוצר...</Box>
      </Box>
    );
  }

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
            gap={"100px"}
            justifyContent={"center"}
            alignItems={"flex-start"}
            flexWrap={"wrap"}
            p="20px"
          >
            <VStack align="stretch" gap="22px" maxW="450px">
              <FormControl isInvalid={!!errors.productName}>
                <FormLabel>שם מוצר:</FormLabel>
                <Input
                  type="text"
                  placeholder="שם מוצר"
                  aria-label="שם מוצר"
                  {...register("productName", { required: "שדה חובה" })}
                  isDisabled={isEditForm}
                />
                {errors.productName && (
                  <FormErrorMessage color="primary.error">
                    {errors.productName.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.category}>
                <FormLabel>קטגוריה:</FormLabel>
                <Select
                  placeholder="קטגוריה"
                  aria-label="קטגוריה"
                  {...register("category", {
                    required: "שדה חובה",
                  })}
                  isDisabled={isEditForm}
                >
                  {categories?.map((category, idx) => {
                    return (
                      <option key={idx} value={category}>
                        {category}
                      </option>
                    );
                  })}
                </Select>

                {errors.category && (
                  <FormErrorMessage color="primary.error">
                    {errors.category.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>חברה:</FormLabel>
                <Input
                  type="text"
                  placeholder="שם חברה"
                  aria-label="חברה"
                  {...register("company")}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.status}>
                <FormLabel>סטטוס:</FormLabel>
                <Select
                  placeholder="בחר סטטוס"
                  aria-label="סטטוס"
                  {...register("status", { required: "שדה חובה" })}
                >
                  <option value="פעיל">פעיל</option>
                  <option value="מושהה">מושהה</option>
                  <option value="תקול">תקול</option>
                  <option value="נמכר">נמכר</option>
                </Select>

                {errors.status && (
                  <FormErrorMessage color="primary.error">
                    {errors.status.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>תחילת אחריות:</FormLabel>
                <Input
                  type="date"
                  placeholder="תחילת אחריות"
                  aria-label="תחילת אחריות"
                  {...register("warranty.startDate")}
                />
              </FormControl>

              <FormControl>
                <FormLabel>סיום אחריות:</FormLabel>
                <Input
                  type="date"
                  placeholder="סיום אחריות"
                  aria-label="סיום אחריות"
                  {...register("warranty.endDate")}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.specification}>
                <FormLabel>מפרט:</FormLabel>
                <Textarea
                  minH="80px"
                  type="text"
                  placeholder="מפרט"
                  aria-label="מפרט"
                  {...register("specification")}
                />
                {errors.specification && (
                  <FormErrorMessage color="primary.error">
                    {errors.specification.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.notes}>
                <FormLabel>הערות:</FormLabel>
                <Textarea
                  minH="80px"
                  type="text"
                  placeholder="הערות"
                  aria-label="הערות"
                  {...register("notes")}
                />
                {errors.notes && (
                  <FormErrorMessage color="primary.error">
                    {errors.notes.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </VStack>
            <VStack align="stretch" gap="22px" maxW="450px">
              {selectedCategory === "מחשבים" && (
                <>
                  <FormControl>
                    <Checkbox
                      variant={"goldCb"}
                      {...register("computerDetails.isAdvanced")}
                      defaultChecked={
                        initialData.computerDetails?.isAdvanced || false
                      }
                    >
                      מחשב מתקדם
                    </Checkbox>
                  </FormControl>
                  <FormControl>
                    <FormLabel>מספר סידורי:</FormLabel>
                    <Input
                      placeholder="מספר סידורי"
                      aria-label="מספר סידורי"
                      {...register("computerDetails.serialNumber")}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>מס רישיון Office:</FormLabel>
                    <Input
                      placeholder="מס רישיון Office"
                      aria-label="מס רישיון Office"
                      {...register("computerDetails.officeLicense")}
                    />
                  </FormControl>

                  <FormControl w="100%" maxW="300px">
                    <FormLabel>תוכנות מותקנות:</FormLabel>
                    <Controller
                      control={control}
                      name="computerDetails.softwares"
                      render={({ field }) => {
                        const flatOptions = flattenOptions(softwareCategories);

                        return (
                          <ReactSelect
                            isMulti
                            options={softwareCategories}
                            value={flatOptions.filter((opt) =>
                              field.value?.includes(opt.value),
                            )}
                            onChange={(selected) =>
                              field.onChange(selected.map((s) => s.value))
                            }
                            placeholder="בחר תוכנות"
                            styles={reactSelectStyles}
                          />
                        );
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>תאריך בדיקה:</FormLabel>
                    <Input
                      type="date"
                      placeholder="תאריך בדיקה"
                      aria-label="תאריך בדיקה"
                      {...register("computerDetails.checkDate")}
                    />
                  </FormControl>
                </>
              )}

              {isNetworkDevice && (
                <>
                  <FormControl
                    isInvalid={
                      !!errors?.networkDetails?.simDetails?.phoneNumber
                    }
                  >
                    <FormLabel>מספר טלפון:</FormLabel>
                    <Input
                      placeholder="מספר טלפון"
                      {...register("networkDetails.simDetails.phoneNumber", {
                        required: isNetworkDevice ? "שדה חובה" : false,
                        pattern: {
                          value: /^0(5\d{8}|[2-4,8,9]\d{7})$/,
                          message: "מספר טלפון לא תקין",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors?.networkDetails?.simDetails?.phoneNumber?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={!!errors?.networkDetails?.simDetails?.simNumber}
                  >
                    <FormLabel>מספר סים:</FormLabel>
                    <Input
                      placeholder="מספר סים"
                      {...register("networkDetails.simDetails.simNumber", {
                        required: isNetworkDevice ? "שדה חובה" : false,
                        pattern: {
                          value: /^\d{18,22}$/,
                          message: "מספר סים לא תקין",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors?.networkDetails?.simDetails?.simNumber?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={
                      !!errors?.networkDetails?.simDetails?.carrierCompany
                    }
                  >
                    <FormLabel>חברת סלולר:</FormLabel>
                    <Input
                      placeholder="חברת סלולר"
                      {...register("networkDetails.simDetails.carrierCompany", {
                        required: isNetworkDevice ? "שדה חובה" : false,
                      })}
                    />
                    <FormErrorMessage>
                      {
                        errors?.networkDetails?.simDetails?.carrierCompany
                          ?.message
                      }
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={!!errors?.networkDetails?.wifiDetails?.ssid}
                  >
                    <FormLabel>SSID:</FormLabel>
                    <Input
                      placeholder="שם רשת"
                      {...register("networkDetails.wifiDetails.ssid", {
                        required: isNetworkDevice ? "שדה חובה" : false,
                      })}
                    />
                    <FormErrorMessage>
                      {errors?.networkDetails?.wifiDetails?.ssid?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={!!errors?.networkDetails?.wifiDetails?.password}
                  >
                    <FormLabel>סיסמת WiFi:</FormLabel>
                    <Input
                      placeholder="סיסמה"
                      type="text"
                      {...register("networkDetails.wifiDetails.password", {
                        required: isNetworkDevice ? "שדה חובה" : false,
                        minLength: {
                          value: 4,
                          message: "סיסמה חייבת להיות לפחות 4 תווים",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors?.networkDetails?.wifiDetails?.password?.message}
                    </FormErrorMessage>
                  </FormControl>
                </>
              )}
            </VStack>
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
