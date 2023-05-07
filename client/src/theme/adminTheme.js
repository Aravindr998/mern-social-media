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
              main: "#940000",
            },
            background: {
              default: "#1A1818",
              paper: "#262424",
            },
          }),
    },
    shape: {
      borderRadius: 7,
    },
  }
}
