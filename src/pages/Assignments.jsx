// src/pages/Assignments.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AssignmentCard from '../components/AssignmentCard';

function Assignments() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get('/assignments');
        setAssignments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">All Assignments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <AssignmentCard key={assignment._id} assignment={assignment} />
        ))}
      </div>
    </div>
  );
}

export default Assignments;
