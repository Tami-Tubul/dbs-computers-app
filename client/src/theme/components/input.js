import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    w: "300px",
    p: "8px 16px 10px 16px",
    height: "40px",
    lineHeight: "22px",
    boxShadow: " 0px 2px 20px 0px rgba(0, 0, 0, 0.08)",
    borderRadius: "12px",
    borderWidth: "1px",
    borderColor: "transparent",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: 400,
    color: "primary.runningText",
    "::placeholder": {
      color: "primary.grayBlue",
    },
    _hover: {
      "::placeholder": {},
    },
    // _disabled: {
    //   bgColor: "rgba(151, 168, 191, 0.20)",
    //   color: "primary.grayBlue",
    //   "::placeholder": {
    //     color: "primary.grayBlue",
    //   },
    // },
    _active: {},
    _invalid: {
      borderColor: "primary.error",
    },
  },
});

const timeInput = definePartsStyle({
  field: {
    w: "83px",
    p: "8px 14px 10px 14px",
    "&::-webkit-calendar-picker-indicator": {
      background: "transparent",
      bottom: "0",
      color: "transparent",
      cursor: "pointer",
      height: "auto",
      left: "0",
      position: "absolute",
      right: "0",
      top: "0",
      width: "auto",
      display: "none",
    },
  },
});

const brand = definePartsStyle({});

const inputTheme = defineMultiStyleConfig({
  baseStyle,
  defaultProps: { variant: brand },
  variants: { brand, timeInput },
});

export default inputTheme;
