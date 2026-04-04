import React, { useState } from "react";

import {
  FormControl,
  Input,
  Heading,
  VStack,
  Button,
  FormErrorMessage,
  Image,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    setValue,
    trigger,
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (fieldName, e) => {
    const inputValue = e.target.value;
    setValue(fieldName, inputValue);
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const resp = await api.epLogin(values);
      if (resp.status === 200) {
        dispatch({ type: "CONNECT", payload: resp.data });
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
      if (error.response?.data) alert(error.response.data.message);
      else {
        alert("אירעה תקלה. אנא בדקו את החיבור לאינטרנט או נסו שוב מאוחר יותר");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack px="0px" w="100%" maxW="100%" h="100%" justifyContent={"center"}>
      <Image
        src="/assets/images/logo.jpg"
        alt="לוגו DBS"
        width="400px"
        height="200px"
      />
      <VStack as="form" gap="30px" onSubmit={handleSubmit(onSubmit)}>
        <Heading as="h1" variant={"h1"} pt="40px">
          התחברות למערכת
        </Heading>

        <FormControl maxW="322px" isInvalid={errors.id}>
          {/* <FormLabel>שם משתמש</FormLabel> */}
          <Input
            w="322px"
            textAlign="center"
            id="username"
            {...register("username", {
              required: "שם משתמש הוא שדה חובה",
            })}
            onChange={(e) => {
              handleChange("username", e);
              trigger("username");
            }}
            type="text"
            placeholder="נא להקליד שם משתמש"
            aria-label="נא להקליד שם משתמש"
          />
          {errors.username && (
            <FormErrorMessage color="primary.error" pl="10px" pt="2px">
              {errors.username.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl maxW="322px" isInvalid={errors.id}>
          {/* <FormLabel>סיסמא</FormLabel> */}
          <Input
            w="322px"
            textAlign="center"
            id="password"
            {...register("password", {
              required: "סיסמא היא שדה חובה",
            })}
            onChange={(e) => {
              handleChange("password", e);
              trigger("password");
            }}
            type="password"
            placeholder="נא להקליד סיסמא"
            aria-label="נא להקליד סיסמא"
          />
          {errors.password && (
            <FormErrorMessage color="primary.error" pl="10px" pt="2px">
              {errors.password.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <Button
          type="submit"
          variant="primary"
          isDisabled={!isValid}
          isLoading={isLoading}
        >
          כניסה
        </Button>
      </VStack>
    </VStack>
  );
}
