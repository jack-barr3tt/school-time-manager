import { Container, createTheme, Paper, ScopedCssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React from 'react';
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

export default function App() {
  const isMobile = useMediaQuery("(max-width: 425px)");
  return (
    <ScopedCssBaseline>
      <ThemeProvider theme={theme}>{
        isMobile ? 
        <Router/> : 
        <Container maxWidth="sm" disableGutters={true}>
            <Paper>
                <Router/>
            </Paper>
        </Container>
      }</ThemeProvider>
    </ScopedCssBaseline>
  )
}