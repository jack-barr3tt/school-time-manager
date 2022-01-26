import React from 'react';
import { Link } from 'react-router-dom';

export default function Timetable() {
  return <div>
      <h2>Timetable</h2>
      <Link to="new">New Timetable Entry</Link>
  </div>;
}
