import React from 'react';
import { Link } from 'react-router-dom';

export default function Setup() {
  return <div>
      <h2>Setup</h2>
      <Link to="days">Set School Days</Link>
      <Link to="times">Set Lesson Times</Link>
  </div>;
}
