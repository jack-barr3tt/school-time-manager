import { Stack, useMediaQuery, Container, Paper, createTheme } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { ReactNode } from 'react';
import './App.css';
import { Providers } from './Providers';
import RouteProtector from './RouteProtector';
import Router from './Router';

export const theme = createTheme({
    breakpoints: {
        // Defines the minimum width in pixels for each screen size
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
  return <Stack 
    spacing={2} 
    sx={{ 
        width: 1, 
        height: 1, 
        positon: "absolute", 
        top: 0, 
        left: 0, 
        m: 0, 
        px: 2, 
        overflowY: "scroll" 
    }}>
        {props.children}
    </Stack>
}

export default function App() {

    // Mobile screens are those with a width less than the value of the "sm" breakpoint
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.values.sm}px)`)
    
    return <Providers>
        {
            isMobile ? 
            // If mobile, render the layout without a container
            <RouteProtector>
                <MainGrid>
                    <Router/>
                </MainGrid>
            </RouteProtector>
            :
            // If not mobile, render the layout with a container
            <Container maxWidth="sm" disableGutters sx={{ height: 1, py: 2 }}>
                <Paper sx={{ position: "relative", height: 1 }}>
                <RouteProtector>
                    <MainGrid>
                        <Router/>
                    </MainGrid>
                </RouteProtector>
            </Paper>
            </Container>
        }
    </Providers>
}