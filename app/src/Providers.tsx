import { ThemeProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { ScopedCssBaseline } from "@mui/material";
import { ReactNode } from "react";
import { theme } from "./App";
import { HomeworkProvider } from "./Hooks/useHomework";

export default function Providers(props: { children: ReactNode }) {
    const { children } = props
    
    return <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ScopedCssBaseline>
                <ThemeProvider theme={theme}>
                    <HomeworkProvider>
                        {children}
                    </HomeworkProvider>
                </ThemeProvider>
            </ScopedCssBaseline>
        </LocalizationProvider>
    </>
}