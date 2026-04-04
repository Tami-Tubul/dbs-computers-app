import { numberInputAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const brand = definePartsStyle({
  root: {},
  field: {
    height: "40px",
    borderColor: "primary.dbsBlue",
    borderRadius: "12px",
    boxShadow: " 0px 2px 20px 0px rgba(0, 0, 0, 0.08)",
    _hover: { borderColor: "primary.dbsBlueDark" },
    _focus: {
      borderColor: "primary.dbsBlueDark",
      boxShadow: "0 0 0 1px primary.dbsBlueDark",
    },
    textAlign: "center",
    fontSize: "16px",
  },
  stepperGroup: {},
  stepper: {
    border: "none",
    bg: "primary.dbsBlue",
    color: "white",

    _first: { borderTopRightRadius: "12px" },
    _last: { borderBottomRightRadius: "12px" },
    _hover: { bg: "primary.dbsBlue" },
    _active: { bg: "primary.dbsBlue" },
  },
});

const numberInputTheme = defineMultiStyleConfig({
  variants: { brand },
  defaultProps: {
    variant: "brand",
  },
});

export default numberInputTheme;
