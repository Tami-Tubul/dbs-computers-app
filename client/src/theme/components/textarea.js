import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyle({
  w: "inherit",
  h: "167px",
  p: "16px 11px",
  borderWidth: "1px",
  borderColor: "transparent",
  boxShadow: " 0px 2px 20px 0px rgba(0, 0, 0, 0.08)",
  background: "#FFF",
  borderRadius: "12px",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "26px",
  color: "primary.runningText",
  "::placeholder": {
    color: "primary.grayBlue",
  },
  _invalid: {
    borderColor: "primary.error",
  },
});

const brand = defineStyle({});

const textareaTheme = defineStyleConfig({
  baseStyle,
  variants: { brand },
  defaultProps: {
    variant: "brand",
  },
});

export default textareaTheme;
