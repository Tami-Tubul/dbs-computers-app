import { tabsAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const brand = definePartsStyle({
  tablist: {
    display: "flex",
    gap: "10px",
    mt: "20px",
    borderBottom: "1px solid",
    borderColor: "primary.disabled",
    px: "10px",
  },

  tab: {
    fontSize: "18px",
    fontWeight: 500,
    color: "primary.runningText",
    py: "10px",
    mb: "-1px",
    borderRadius: "14px 14px 0 0",
    transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
    border: "1px solid transparent",
    borderBottom: "none",

    _hover: {
      color: "primary.dbsBlueDark",
      bg: "primary.hover",
    },

    _selected: {
      color: "primary.runningText",
      bg: "primary.lightBlue",
      fontWeight: 700,
      borderColor: "primary.disabled",
      borderBottomColor: "white",
      boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
    },
  },

  tabpanel: {
    pt: "32px",
    color: "primary.runningText",
  },

  indicator: {
    display: "none",
  },
});
const tabTheme = defineMultiStyleConfig({
  variants: { brand },
  defaultProps: {
    variant: "brand",
  },
});
export default tabTheme;
