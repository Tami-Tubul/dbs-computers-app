import { popoverAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  popper: {},
  content: {
    maxW: "450px",
    w: "100%",
    p: "20px",
    color: "primary.runningText",
    boxShadow: "0px 2px 20px 0px #00000014",
    border: "none",
    gap: "16px",
  },
  header: {
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "normal",
    p: "0px",
    border: "none",
  },
  body: {
    p: "0px",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    p: "42px 0px 0px 0px",
    border: "none",
  },
  closeButton: {
    top: "20px",
    right: "20px",
    backgroundImage: "url('/assets/icons/close_modal.svg')",
    p: "0px",
  },
});

const brand = definePartsStyle({});

const popoverTheme = defineMultiStyleConfig({
  baseStyle,
  variants: { brand },
});
export default popoverTheme;
