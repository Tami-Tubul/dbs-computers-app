import { HStack, FormControl, Input, Button, FormErrorMessage, Box, Stack, Spinner } from "@chakra-ui/react"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";

export default function CustomerForm({ initialData = {}, onSubmit, isLoading, isEditForm }) {

    const { register, handleSubmit, reset, formState: { errors, isValid, isDirty }, control, setValue } = useForm();

    useEffect(() => {
        reset();
    }, [])

    return (
        <>
            {isEditForm && _.isEmpty(initialData) ?
                <Box h={"100%"} mt="150px">
                    <Spinner />
                </Box>
                :
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
                    <HStack gap="20px" justifyContent={"center"} flexWrap={"wrap"} p="20px">
                        <Stack alignItems="flex-start" gap="22px">
                            <FormControl isInvalid={!!errors.firstname}>
                                <Input
                                    type="text"
                                    defaultValue={initialData.firstname || ""}
                                    placeholder="שם פרטי"
                                    aria-label="שם פרטי"
                                    {...register("firstname", { required: "שדה חובה" })}
                                />
                                {errors.firstname && (
                                    <FormErrorMessage color="primary.error">
                                        {errors.firstname.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl isInvalid={!!errors.lastname}>
                                <Input
                                    type="text"
                                    defaultValue={initialData.lastname || ""}
                                    placeholder="שם משפחה"
                                    aria-label="שם משפחה"
                                    {...register("lastname", { required: "שדה חובה" })}
                                />
                                {errors.lastname && (
                                    <FormErrorMessage color="primary.error">
                                        {errors.lastname.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl isInvalid={!!errors.phone} >
                                <Input
                                    type="text"
                                    defaultValue={initialData.phone || ""}
                                    placeholder="מספר טלפון"
                                    aria-label="מספר טלפון"
                                    maxLength={12}
                                    {...register("phone", {
                                        required: "שדה חובה",
                                        pattern: {
                                            value: /^(0[23489]\d{7}|0[23489]-?\d{7}|05[0-9]\d{7}|05[0-9]-?\d{7})$/,
                                            message: "נא להזין מספר טלפון חוקי",
                                        },
                                    })}
                                />
                                {errors.phone && (
                                    <FormErrorMessage color="primary.error">
                                        {errors.phone.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl isInvalid={!!errors.address}>
                                <Input
                                    type="text"
                                    defaultValue={initialData.address || ""}
                                    placeholder="כתובת"
                                    aria-label="כתובת"
                                    {...register("address")}
                                />
                                {errors.address && (
                                    <FormErrorMessage color="primary.error">
                                        {errors.address.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl isInvalid={!!errors.email}>
                                <Input
                                    type="email"
                                    defaultValue={initialData.email || ""}
                                    placeholder="מייל"
                                    aria-label="מייל"
                                    {...register("email", {
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "נא להזין מייל תקין"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <FormErrorMessage color="primary.error">
                                        {errors.email.message}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                        </Stack>
                    </HStack>
                    <Button
                        type="submit"
                        variant="primary"
                        mt="24px"
                        isDisabled={isEditForm && !isDirty}
                        isLoading={isLoading}
                    >שמירה</Button>
                </Box>
            }
        </>
    )
}