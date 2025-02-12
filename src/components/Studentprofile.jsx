// src/components/StudentProfile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function StudentProfile() {
  const { auth } = useContext(AuthContext);
  const [counters, setCounters] = useState({
    totalSolved: 0,
    pendingHW: 0,
    pendingCW: 0,
    pendingPersonal: 0
  });

  useEffect(() => {
    // Fetch both public and personal assignments for the logged-in student
    const fetchCounters = async () => {
      try {
        const publicRes = await api.get('/assignments', { params: { category: 'public' } });
        const personalRes = await api.get('/assignments/personal');
        const allAssignments = [...publicRes.data, ...personalRes.data];
        let totalSolved = 0;
        let pendingHW = 0;
        let pendingCW = 0;
        let pendingPersonal = 0;
        const studentId = auth.user.id;
        
        allAssignments.forEach((assignment) => {
          // Find the student's response in the assignment's responses array
          const response = assignment.responses.find(
            (resp) => resp.student.toString() === studentId
          );
          const isSolved = response && response.responseStatus === 'solved';
          if (isSolved) {
            totalSolved++;
          } else {
            // Count pending by assignment tag if not solved
            if (assignment.assignmentTag === 'HW') {
              pendingHW++;
            }
            if (assignment.assignmentTag === 'CW') {
              pendingCW++;
            }
            // For personal assignments, count pending even if the assignment tag might be different
            if (assignment.category === 'personal') {
              pendingPersonal++;
            }
          }
        });
        
        setCounters({ totalSolved, pendingHW, pendingCW, pendingPersonal });
      } catch (err) {
        console.error(err);
      }
    };

    if (auth && auth.user) {
      fetchCounters();
    }
  }, [auth]);

  if (!auth || !auth.user) return null;
  const { user } = auth;

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        {/* Left Section: User Details */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-1">Welcome, {user.name}</h2>
          <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
          <p className="text-gray-700"><strong>Branch:</strong> {user.branch || 'N/A'}</p>
          <p className="text-gray-700"><strong>Year:</strong> {user.year || 'N/A'}</p>
          <p className="text-gray-700"><strong>Role:</strong> {user.role}</p>
        </div>
        {/* Right Section: Counters */}
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row sm:space-x-4">
          <div className="bg-green-100 text-green-700 rounded p-2 text-center">
            <p className="text-sm font-bold">Total Solved</p>
            <p className="text-lg">{counters.totalSolved}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-700 rounded p-2 text-center">
            <p className="text-sm font-bold">Pending HW</p>
            <p className="text-lg">{counters.pendingHW}</p>
          </div>
          <div className="bg-red-100 text-red-700 rounded p-2 text-center">
            <p className="text-sm font-bold">Pending CW</p>
            <p className="text-lg">{counters.pendingCW}</p>
          </div>
          <div className="bg-blue-100 text-blue-700 rounded p-2 text-center">
            <p className="text-sm font-bold">Pending Personal</p>
            <p className="text-lg">{counters.pendingPersonal}</p>
          </div>
        </div>
      </div>
      {/* Optional: Display Profile Image */}
      {/* <div className="mt-4">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default StudentProfile;
