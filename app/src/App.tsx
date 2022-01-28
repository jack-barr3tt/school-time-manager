import { Container, createTheme, Grid, Paper, ScopedCssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React, { ReactElement } from 'react';
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
  return <Grid container direction="column" spacing={2} alignItems="center">{children}</Grid>
}

export default function App() {
  const isMobile = useMediaQuery("(max-width: 441px)");
  return (
    <ScopedCssBaseline>
      <ThemeProvider theme={theme}>{
        isMobile ? 
        <Container sx={{ p: 2 }}>
          <MainGrid>
            <Router/>
          </MainGrid>
        </Container> : 
        <Container maxWidth="sm" disableGutters>
            <Paper sx={{ p: 2 }}>
              <MainGrid>
                <Router/>
              </MainGrid>
            </Paper>
        </Container>
      }</ThemeProvider>
    </ScopedCssBaseline>
  )
}