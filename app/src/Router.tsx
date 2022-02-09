import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Homework from './Pages/Homework/Homework';
import SetWorkingTimes from './Pages/Setup/WorkingTimes/ViewWorkingTimes';
import ViewHomework from './Pages/Homework/ViewHomework';
import NewHomework from './Pages/Homework/NewHomework';
import PreWarning from './Pages/Setup/PreWarning';
import SetDays from './Pages/Setup/SetSchoolDays';
import Setup from './Pages/Setup/Setup';
import NewWorkingTime from './Pages/Setup/WorkingTimes/NewWorkingTime';
import NewTimetable from './Pages/Timetable/NewTimetable';
import Timetable from './Pages/Timetable/Timetable';
import ViewBlocks from './Pages/Setup/LessonBlocks/ViewBlocks';
import NewBlock from './Pages/Setup/LessonBlocks/NewBlock';

export default function Router() {
    return <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route index element={<Home/>}/>
                <Route path="homework">
                    <Route index element={<Homework/>}/>
                    <Route path="new" element={<NewHomework/>}/>
                    <Route path=":id" element={<ViewHomework/>}/>
                </Route>
                <Route path="timetable">
                    <Route index element={<Timetable/>}/>
                    <Route path="new" element={<NewTimetable/>}/>
                </Route>
                <Route path="setup">
                    <Route index element={<Setup/>}/>
                    <Route path="days" element={<SetDays/>}/>
                    <Route path="prewarning" element={<PreWarning/>}/>
                    <Route path="times">
                        <Route index element={<ViewBlocks/>}/>
                        <Route path="new" element={<NewBlock/>}/>
                    </Route>
                    <Route path="workingtimes">
                        <Route index element={<SetWorkingTimes/>}/>
                        <Route path="new" element={<NewWorkingTime/>}/>
                    </Route>
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
}
