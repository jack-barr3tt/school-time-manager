import { Stack, useMediaQuery, Container, Paper, createTheme } from '@mui/material';
import { ReactNode, createContext } from 'react';
import './App.css';
import Providers from './Providers';
import Router from './Router';

export const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 425,
            md: 960,
            lg: 1280,
            xl: 1920
        }
    },
    palette: {
        secondary: {
            main: "#c2e7ff",
            light: "#f5ffff",
            dark: "#91b5cc"
        }
    },
    components: {
        MuiFab: {
            defaultProps: {
                color: "secondary"
            }
        }
    }
})

function MainGrid (props: { children: ReactNode }) {
  return <Stack spacing={2} sx={{ width: "100%", positon: "absolute", top: 0, left: 0, m: 0, px: 2, height: "100%", overflowY: "scroll" }}>{props.children}</Stack>
}

export const userContext = createContext({
    id: 1,
    username: "Jack"
})

export default function App() {

    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.values.sm}px)`);
    
    return <Providers>
        {
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
        }
    </Providers>
}