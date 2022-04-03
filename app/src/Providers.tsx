import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { ScopedCssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";
import { theme } from "./App";
import { HomeworkProvider } from "./Hooks/useHomework";
import { TimetableProvider } from "./Hooks/useTimetable";
import { WeekProvider } from "./Hooks/useWeek";

export default function Providers(props: { children: ReactNode }) {
    const { children } = props
    
    return <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ScopedCssBaseline>
                <ThemeProvider theme={theme}>
                    <HomeworkProvider>
                        <WeekProvider>
                            <TimetableProvider>
                                {children}
                            </TimetableProvider>
                        </WeekProvider>
                    </HomeworkProvider>
                </ThemeProvider>
            </ScopedCssBaseline>
        </LocalizationProvider>
    </>
}