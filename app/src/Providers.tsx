import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { ScopedCssBaseline, ThemeProvider } from "@mui/material";
import { enGB } from "date-fns/locale";
import { ReactNode } from "react";
import { theme } from "./App";
import { UserProvider } from "./Hooks/useUser";

export function Providers(props: { children: ReactNode }) {
    const { children } = props

    // Providers that are needed for all parts of the app
    return <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}>
        <ScopedCssBaseline>
            <ThemeProvider theme={theme}>
                <UserProvider>
                    {children}
                </UserProvider>
            </ThemeProvider>
        </ScopedCssBaseline>
    </LocalizationProvider>
}