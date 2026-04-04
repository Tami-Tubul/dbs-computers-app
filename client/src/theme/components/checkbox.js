import { checkboxAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const brand = definePartsStyle({
  icon: {},
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "6px",
  },
  control: {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    borderWidth: "1px",
    borderColor: "primary.dbsBlue",
    _checked: {
      bg: "primary.dbsBlue",
      border: "none !important",
      _hover: { bg: "primary.dbsBlue" },
    },
  },
  label: {
    color: "primary.runningText",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
    m: 0,
  },
});

const goldCb = definePartsStyle({
  ...brand,
  control: {
    ...brand.control,
    borderColor: "primary.dbsGoldenrod",
    _checked: {
      bg: "primary.dbsGoldenrod",
      border: "none !important",
      _hover: { bg: "primary.dbsGoldenrod" },
    },
  },
});

const checkboxTheme = defineMultiStyleConfig({
  variants: { brand, goldCb },
  defaultProps: {
    variant: "brand",
  },
});

export default checkboxTheme;
