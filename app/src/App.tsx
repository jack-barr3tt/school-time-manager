import { Stack, useMediaQuery, Container, Paper, createTheme } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { ReactNode } from 'react';
import './App.css';
import { DataProviders, GeneralProviders } from './Providers';
import RouteProtector from './RouteProtector';
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
        },
        success: {
            main: green.A700,
            light: green.A400,
            dark: green[800]
        },
        error: {
            main: red[500],
            light: red[300],
            dark: red[800]
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

export function MainGrid (props: { children: ReactNode }) {
  return <Stack spacing={2} sx={{ width: 1, height: 1, positon: "absolute", top: 0, left: 0, m: 0, px: 2, overflowY: "scroll" }}>{props.children}</Stack>
}

export default function App() {

    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.values.sm}px)`);
    
    return <GeneralProviders>
        {
            isMobile ? 
            <RouteProtector>
                <DataProviders>
                    <MainGrid>
                        <Router/>
                    </MainGrid>
                </DataProviders>
            </RouteProtector>
            :
            <Container maxWidth="sm" disableGutters sx={{ height: 1, py: 2 }}>
                <Paper sx={{ position: "relative", height: 1 }}>
                <RouteProtector>
                    <DataProviders>
                        <MainGrid>
                            <Router/>
                        </MainGrid>
                    </DataProviders>
                </RouteProtector>
            </Paper>
            </Container>
        }
    </GeneralProviders>
}