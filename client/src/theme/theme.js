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
              main: "#8327ff",
            },
            background: {
              default: "#18191a",
              paper: "#242526",
            },
          }),
    },
    shape: {
      borderRadius: 7,
    },
  }
}
