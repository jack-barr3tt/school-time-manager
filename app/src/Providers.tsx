import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { ScopedCssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";
import { theme } from "./App";
import { HomeworkProvider } from "./Hooks/useHomework";
import { TimetableProvider } from "./Hooks/useTimetable";
import { UserProvider } from "./Hooks/useUser";
import { WeekProvider } from "./Hooks/useWeek";

export default function Providers(props: { children: ReactNode }) {
    const { children } = props
    
    return <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ScopedCssBaseline>
                <ThemeProvider theme={theme}>
                    <UserProvider>
                        <HomeworkProvider>
                            <WeekProvider>
                                <TimetableProvider>
                                    {children}
                                </TimetableProvider>
                            </WeekProvider>
                        </HomeworkProvider>
                    </UserProvider>
                </ThemeProvider>
            </ScopedCssBaseline>
        </LocalizationProvider>
    </>
}