export const defaultTheme = (mode) => {
  return {
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: "#530094",
            },
            background: {
              default: "#CBC6DB",
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
