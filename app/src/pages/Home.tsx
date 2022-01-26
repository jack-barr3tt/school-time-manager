import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return <div>
      <h2>Welcome</h2>
      <Link to="timetable">Timetable</Link>
      <Link to="homework">Homework</Link>
      <Link to="setup">Setup</Link>
  </div>;
}
