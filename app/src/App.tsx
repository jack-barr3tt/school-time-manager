import { Container, createTheme, Paper, ScopedCssBaseline, Stack, ThemeProvider, useMediaQuery } from '@mui/material';
import './App.css';
import Router from './Router';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 425,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
})

const MainGrid : React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Stack spacing={2} sx={{ width: "100%", positon: "absolute", top: 0, left: 0, m: 0, px: 2, height: "100%", overflowY: "scroll" }}>{children}</Stack>
}

export default function App() {
  const isMobile = useMediaQuery("(max-width: 441px)");
  return (
    <ScopedCssBaseline>
      <ThemeProvider theme={theme}>{
        isMobile ? 
          <MainGrid>
            <Router/>
          </MainGrid> :
        <Container maxWidth="sm" disableGutters sx={{ height: "100%", py: 2 }}>
            <Paper sx={{ position: "relative", height: "100%" }}>
              <MainGrid>
                <Router/>
              </MainGrid>
            </Paper>
        </Container>
      }</ThemeProvider>
    </ScopedCssBaseline>
  )
}