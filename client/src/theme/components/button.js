import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
  p: "16px 32px",
  bgColor: "primary.dbsBlue",
  borderRadius: "15px",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "normal",
  color: "#fff",
  _hover: {
    bgColor: "primary.mainButtonPressed",
    _disabled: {
      bgColor: "primary.disabled",
    },
  },
  _disabled: {
    bgColor: "primary.disabled",
    color: "#E1E1E1",
    opacity: 1,
  },
});

const secondary = defineStyle({
  p: "32px 64px",
  bgColor: "primary.dbsGold",
  borderRadius: "15px",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "normal",
  color: "primary.runningText",
  border: "1px solid",
  borderColor: "primary.runningText",
  _hover: {
    color: "primary.mainButtonPressed",
    borderColor: "primary.mainButtonPressed",
  },
  _disabled: {
    borderColor: "primary.disabled",
    color: "#ABB6DC",
    opacity: 1,
    _hover: {
      borderColor: "primary.disabled",
      color: "#ABB6DC",
    },
  },
});

const link = defineStyle({
  p: "0",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "normal",
  minW: "fit-content",
  color: "primary.dbsBlue",
  bgColor: "trasparent",
  cursor: "pointer",
  _hover: {
    color: "primary.linkBrandBright",
    textDecoration: "none",
  },
  _disabled: {
    opacity: 1,
    color: "#7E99C0",
    _hover: {
      color: "#7E99C0",
    },
  },
});

const buttonTheme = defineStyleConfig({
  defaultProps: {
    variant: "brand",
  },

  variants: { primary, secondary, link },
});

export default buttonTheme;
