import { selectAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    w: "inherit",
    minW: "146px",
    p: "8px 0px 8px 16px", //because icon stay on the padding
    //p: "8px 19px 8px 16px",
    boxShadow: " 0px 2px 20px 0px rgba(0, 0, 0, 0.08)",
    background: "#FFF",
    borderRadius: "12px",
    borderWidth: "1px",
    borderColor: "transparent",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "24px",
    color: "primary.runningText",
    "::placeholder": {
      color: "primary.grayBlue",
    },
    _invalid: {
      borderColor: "primary.error",
    },
  },
  icon: {},
});

const shortSelect = definePartsStyle({
  field: {
    w: "320px",
  },
});

const brand = definePartsStyle({});

const selectTheme = defineMultiStyleConfig({
  baseStyle,
  defaultProps: { variant: brand },
  variants: { brand, shortSelect },
});

export default selectTheme;
