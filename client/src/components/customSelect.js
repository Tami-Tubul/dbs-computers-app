import { Select } from "chakra-react-select";
import React, { forwardRef, useEffect } from "react";

const CustomSelect = forwardRef(
  ({ name, options, placeholder, ...props }, ref) => {
    const noOptionsMessage = () => "אין תוצאות";
    const customAriaLiveMessages = {
      guidance: () => "",
      onFocus: ({ focused, options }) => {
        if (focused) {
          const focusedIndex = options.findIndex(
            (opt) => opt.value === focused.value
          );
          const totalCount = options.length;
          return `בחר אפשרות ${focusedIndex + 1} מתוך ${totalCount}, ${
            focused.label
          }`;
        }
        return "בחר אפשרות";
      },
      onMenuOpen: () =>
        "האפשרויות זמינות, השתמש במקשי החצים למעלה ולמטה כדי לבחור",
      onMenuClose: () => "התפריט נסגר",
      onSelect: ({ label }) => `אפשרות ${label} נבחרה`,
    };

    useEffect(() => {
      const selectElements = document.querySelectorAll(
        '[aria-autocomplete="list"]'
      );
      selectElements.forEach((el) => {
        el.setAttribute("aria-autocomplete", "none");
      });
    }, []);

    return (
      <Select
        ref={ref}
        {...props}
        name={name}
        options={options}
        noOptionsMessage={noOptionsMessage}
        placeholder={placeholder}
        closeMenuOnSelect={true}
        selectedOptionStyle="check"
        isClearable
        size="lg"
        ariaLiveMessages={customAriaLiveMessages} // Add customAriaLiveMessages here
        chakraStyles={{
          control: (prev) => ({
            ...prev,
            width: "282px",
            height: "40px",
            minHeight: "40px",
            maxHeight: "40px",
            padding: "8px 8px 8px 16px",
            borderRadius: "12px",
            background: "#FFF",
            boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.08)",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            fontSize: "18px",
          }),
          menu: (prev) => ({
            ...prev,
            width: "300px",
            overflow: "hidden",
            boxShadow: "0px 2px 20px 0px #00000014",
            borderRadius: "12px",
          }),
          valueContainer: (prev) => ({
            ...prev,
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "nowrap",
            p: "0px",
            " & > div:has(>input)": {
              p: "0px",
              m: "0px",
              width: "0px",
            },
          }),
          placeholder: (prev) => ({
            ...prev,
            color: "primary.grayBlue",
          }),
          clearIndicator: (prev) => ({
            ...prev,
            // display: "none",
            width: "12px",
            height: "12px",
            " & > svg": {
              width: "10px",
              height: "10px",
            },
          }),
          dropdownIndicator: (prev, { selectProps: { menuIsOpen } }) => ({
            ...prev,
            color: "transparent", //hide the original icon
            backgroundImage: `url(/assets/icons/${
              menuIsOpen ? "select_arrow_up" : "select_arrow_down"
            }.svg)`,
            backgroundRepeat: "no-repeat",
            width: "24px",
            height: "24px",
            p: "0px",
          }),
        }}
      />
    );
  }
);
CustomSelect.displayName = "CustomSelect";
export default CustomSelect;
