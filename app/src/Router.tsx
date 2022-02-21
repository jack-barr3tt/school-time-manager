import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Homework from './Pages/Homework/Homework';
import SetWorkingTimes from './Pages/Setup/WorkingTimes/ViewWorkingTimes';
import ViewHomework from './Pages/Homework/ViewHomework';
import NewHomework from './Pages/Homework/NewHomework';
import PreWarning from './Pages/Setup/PreWarning';
import Setup from './Pages/Setup/Setup';
import NewWorkingTime from './Pages/Setup/WorkingTimes/NewWorkingTime';
import Timetable from './Pages/Timetable/Timetable';
import ViewBlocks from './Pages/Setup/LessonBlocks/ViewBlocks';
import NewBlock from './Pages/Setup/LessonBlocks/NewBlock';
import ViewRepeats from './Pages/Setup/Repeats/ViewRepeats';
import NewRepeat from './Pages/Setup/Repeats/NewRepeat';

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
                </Route>
                <Route path="setup">
                    <Route index element={<Setup/>}/>
                    <Route path="repeats">
                        <Route index element={<ViewRepeats/>}/>
                        <Route path="new" element={<NewRepeat/>}/>
                    </Route>
                    <Route path="times">
                        <Route index element={<ViewBlocks/>}/>
                        <Route path="new" element={<NewBlock/>}/>
                    </Route>
                    <Route path="workingtimes">
                        <Route index element={<SetWorkingTimes/>}/>
                        <Route path="new" element={<NewWorkingTime/>}/>
                    </Route>
                    <Route path="prewarning" element={<PreWarning/>}/>
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
}
