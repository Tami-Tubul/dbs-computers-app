import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  overlay: {
    bg: "rgba(144, 169, 205, 0.6)",
    backdropFilter: "blur(2px)",
    w: "100%",
    h: "100%",
  },
  dialogContainer: {
    w: "100%",
    h: "100%",
  },
  dialog: {
    boxShadow: "0px 2px 20px 0px #00000014",
    background: " #FFFFFF",
    borderRadius: "20px",
    p: "40px",
  },
  header: {
    pt: "0px",
    textAlign: "center",
    fontSize: "22px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "normal",
    color: "primary.runningText",
  },
  body: {
    p: "0px",
    textAlign: "center",
  },
  footer: {
    // justifyContent: "center",
    // alignItems:"flex-end",
    // gap: "12px",
    // p:"32px 0px 0px 0px",
  },
});

const fullScreenModal = definePartsStyle({
  overlay: {
    mt: "66px",
  },
  dialog: {
    borderRadius: "0px",
  },
  footer: {
    justifyContent: "center",
    pb: "32px",
  },
});

const fullScreenModalWithHeader = definePartsStyle({
  ...fullScreenModal,
  overlay: {
    mt: "0",
  },
  dialogContainer: {
    mt: "66px",
  },
});

const modalTheme = defineMultiStyleConfig({
  baseStyle,
  variants: { fullScreenModal, fullScreenModalWithHeader },
});
export default modalTheme;
