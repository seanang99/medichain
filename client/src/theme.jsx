import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0E4776",
      lighter: "#AADCEF",
      light: "#75C4E0",
    },
    secondary: {
      main: "#F5AD9A",
    },
    orange: "#D9704A",
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});

export default theme;
