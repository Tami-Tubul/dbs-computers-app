import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

// define the base component styles
const header = defineStyle({
  maxW: "100%",
  h: "66px",
  minH: "66px",
  bgColor: "primary.fillColor",
  w: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  display: "flex",
  boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.08)",
  p: "10px",
});

const layout = defineStyle({
  display: "flex",
  maxW: "100%",
  flexDir: "column",
  flex: 1,
  h: "100%",
  w: "100%",
  minH: "100vh",
  p: "0",
});

const main = defineStyle({
  display: "block",
  maxW: "100%",
  overflow: "auto",
  w: "100%",
  h: "calc(100% - 66px)",
  p: "40px",
});

// export the component theme
const containerTheme = defineStyleConfig({
  variants: { header, layout, main },
});

export default containerTheme;
