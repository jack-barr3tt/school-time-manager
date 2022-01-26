import React from 'react';
import { Link } from 'react-router-dom';

export default function Homework() {
  return <div>
      <h2>Homework</h2>
      <Link to="new">Add homework task</Link>
    </div>;
}
