// src/pages/Assignments.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import AssignmentCard from '../components/AssignmentCard';
import { AuthContext } from '../context/AuthContext';

function Assignments() {
  const { auth } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // For mentors/admins, use the /all route
        if (auth?.user?.role === 'mentor' || auth?.user?.role === 'admin') {
          console.log("Calling assignment/all route for mentor or admin and result is:");
          const res = await api.get('/assignments/allResource');
          console.log("res:",res.data)
          setAssignments(res.data);
        } else {
          // For students/volunteers, you might use a different route (e.g., /general or /personal)
          console.log("Calling assignment/all route for students and result is:");

          const res = await api.get('/assignments/general');
          console.log("res:",res.data)

          setAssignments(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignments();
  }, [auth]);


 


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">All Assignments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {assignments && assignments.map((assignment) => (
          <AssignmentCard key={assignment._id} assignment={assignment} />
        ))}
      </div>
    </div>
  );
}

export default Assignments;
