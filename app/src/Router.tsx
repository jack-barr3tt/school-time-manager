import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Homework from './pages/Homework';
import Setup from './pages/Setup';
import Timetable from './pages/Timetable';
import NewHomework from './pages/utility/NewHomework';
import NewTime from './pages/utility/NewTime';
import NewTimetable from './pages/utility/NewTimetable';
import SetDays from './pages/utility/SetDays';
import SetTimes from './pages/utility/SetTimes';

export default function Router() {
  return <BrowserRouter>
  <Routes>
    <Route path="/">
        <Route index element={<Home/>}/>
        <Route path="homework">
            <Route index element={<Homework/>}/>
            <Route path="new" element={<NewHomework/>}/>
        </Route>
        <Route path="timetable">
            <Route index element={<Timetable/>}/>
            <Route path="new" element={<NewTimetable/>}/>
        </Route>
        <Route path="setup">
            <Route index element={<Setup/>}/>
            <Route path="days" element={<SetDays/>}/>
            <Route path="times">
                <Route index element={<SetTimes/>}/>
                <Route path="new" element={<NewTime/>}/>
            </Route>
        </Route>
    </Route>
  </Routes>
</BrowserRouter>
}
