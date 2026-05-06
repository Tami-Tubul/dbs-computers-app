export const reactSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: "#FFF",
    borderRadius: "12px",
    borderColor: state.isFocused ? "transparent" : "transparent",
    boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.08)",
    minHeight: "40px",
    paddingLeft: "8px",
    fontSize: "18px",
    fontWeight: 400,

    "&:hover": {
      borderColor: "transparent",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "8px",
    flexWrap: "wrap",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#7E99C0",
    textAlign: "left",
  }),

  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),

  multiValue: (base) => ({
    ...base,
    borderRadius: "8px",
    margin: "2px",
  }),

  multiValueLabel: (base) => ({
    ...base,
    fontSize: "14px",
  }),

  multiValueRemove: (base) => ({
    ...base,
    cursor: "pointer",
  }),
};
