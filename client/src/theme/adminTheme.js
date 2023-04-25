export const adminTheme = (mode) => {
  return {
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: "#940000",
            },
            background: {
              default: "#dbc6c6",
              paper: "#FFFFFF",
            },
          }
        : {
            primary: {
              main: "#300062",
            },
            background: {
              default: "#313041",
              paper: "#4E4D56",
            },
          }),
    },
    shape: {
      borderRadius: 7,
    },
  }
}
