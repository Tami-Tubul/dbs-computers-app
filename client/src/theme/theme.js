import { extendTheme } from "@chakra-ui/react";
import buttonTheme from "./components/button";
import containerTheme from "./components/container";
import inputTheme from "./components/input";
import selectTheme from "./components/select";
import tableTheme from "./components/table";
import modalTheme from "./components/modal";
import popoverTheme from "./components/popover";
import textareaTheme from "./components/textarea";
import checkboxTheme from "./components/checkbox";
import numberInputTheme from "./components/numberInput";

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  breakpoints: {
    mobile: "0px",
    tablet: "1280px",
    laptop: "1281px",
    desktop: "1440px",
  },
  fonts: {
    heading: "Rubik, sans-serif",
    body: "Rubik, sans-serif",
    mono: "Rubik, sans-serif",
    text: "Rubik, sans-serif",
  },
  colors: {
    primary: {
      runningText: "#0F305E",
      dbsBlue: "#104267",
      dbsGold: "gold",
      dbsGoldenrod: "goldenrod",
      lightBlue: "#E3F0FF",
      wizardFill: "#D3E3FB",
      wizardStroke: "#B7C6DC",
      midBlue: "#9CC5F7",
      grayBlue: "#7E99C0",
      gray: "#97A8BF",
      grayDark: "#59687E",
      disabled: "#BABFD2",
      mainButtonPressed: "#2D4BB6",
      fillColor: "#FBFBFB",
      hover: "#F3F6FA",
      disabledText: "#99A6B8",
      purple: "#7C52AF",
      purpleSelected: "#60319A",
      orange: "#D9831F",
      orangeSelected: "#F7E6D2",
      linkBrandBright: "#3476C6",
      error: "#F4354B",
      green: "#52BE7C",
    },
  },
  styles: {
    global: {
      body: {
        h: "100%",
        position: "relative",
        zIndex: 1,
        background: "primary.fillColor",
        "&:before": {
          zIndex: 0,
          height: "298px",
          left: 0,
          right: 0,
          position: "absolute",
          top: 0,
          content: "''",
          background: "linear-gradient(180deg, #A7CFFF 0%, #FBFBFB 100%)",
        },
        "> div": {
          position: "relative",
        },
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: "primary.runningText",
      },
      variants: {
        h1: {
          fontSize: "28px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
        },
        h2: {
          fontSize: "22px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
        },
        h3: {
          fontSize: "20px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
        },
        h4: {
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
      },
      defaultProps: {
        size: "",
        fontSize: "",
        lineHeight: "",
        variant: "",
        colorScheme: "",
        margin: 0,
        padding: 0,
      },
    },
    Text: {
      baseStyle: {
        color: "primary.runningText",
      },
      variants: {
        runningText: {
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
        runningTextSb: {
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
        },
        runningTextSmall: {
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
        numbers: {
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: "18px",
        fontStyle: "normal",
        fontWeight: 600,
        lineHeight: "normal",
        color: "primary.runningText",
        whiteSpace: "nowrap",
      },
    },
    Button: buttonTheme,
    Input: inputTheme,
    Select: selectTheme,
    Container: containerTheme,
    Table: tableTheme,
    Modal: modalTheme,
    Popover: popoverTheme,
    Textarea: textareaTheme,
    Checkbox: checkboxTheme,
    NumberInput: numberInputTheme,
  },
});

export default theme;
