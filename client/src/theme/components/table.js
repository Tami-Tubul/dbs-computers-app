import { tableAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const brand = definePartsStyle((props) => {
  return {
    table: {},
    th: {},
    td: {},
    tr: {
      ":not(:last-child)": {
        td: {},
      },
    },
    caption: {},
    tfoot: {
      tr: {
        "&:last-of-type": {
          th: {},
        },
      },
    },
  };
});

const orders = definePartsStyle({
  table: {
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    maxHeight: "550px",
  },
  thead: {
    th: {
      color: "primary.runningText",
      fontSize: "18px",
      fontWeight: 600,
      lineHeight: "21.33px",
      paddingInlineStart: ["7px", "7px", "1.5rem", "1.5rem"],
      paddingInlineEnd: ["7px", "7px", "1.5rem", "1.5rem"],
    },
  },
  tbody: {
    color: "primary.runningText",
    fontSize: "22px",
    fontWeight: 400,
    lineHeight: "30px",
    borderTop: "1px",
    maxHeight: "550px",
    overflow: "scroll",
    borderColor: "primary.lightBlue",
    tr: {
      boxShadow: "0 2px 20px 0px rgba(0,0,0,0.08)",
      borderTopLeftRadius: "20px",
      borderBottomLeftRadius: "20px",
      borderTopRightRadius: "20px",
      borderBottomRightRadius: "20px",
      height: "80px",
      cursor: "pointer",
      _hover: {
        bgColor: "#F3F6FA",
      },
      "&.selected": {
        bgColor: "#D3E3FB",
      },
      td: {
        py: "11px",
        paddingInlineStart: ["7px", "7px", "1.5rem", "1.5rem"],
        paddingInlineEnd: ["7px", "7px", "1.5rem", "1.5rem"],
        backgroundColor: "transparent",
        marginTop: "10px",
        "&:first-of-type": {
          borderTopLeftRadius: "20px",
          borderBottomLeftRadius: "20px",
        },
        "&:last-child": {
          borderTopRightRadius: "20px",
          borderBottomRightRadius: "20px",
        },
      },
    },
  },
});

const variants = {
  brand,
  orders,
  unstyled: defineStyle({}),
};

const tableTheme = defineMultiStyleConfig({
  variants,
  defaultProps: {
    variant: "brand",
  },
});
export default tableTheme;
