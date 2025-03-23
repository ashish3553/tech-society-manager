// src/components/AdminProfile.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function AdminProfile() {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    totalVolunteers: 0,
    totalQuestions: 0,
    totalMessages: 0,
    totalDoubts: 0
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // Backend endpoint should aggregate the required data.
        const res = await api.get('/dashboard/admin');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch admin statistics.');
      }
    };
    fetchAdminStats();
  }, [auth]);

  return (
    <div className="p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>
      <p><strong>Name:</strong> {auth.user.name}</p>
      <p><strong>Email:</strong> {auth.user.email}</p>
      <div className="flex flex-wrap gap-4 mt-4">
        <div className="bg-blue-500 text-white px-3 py-1 rounded">
          Total Students: {stats.totalStudents}
        </div>
        <div className="bg-indigo-500 text-white px-3 py-1 rounded">
          Total Mentors: {stats.totalMentors}
        </div>
        <div className="bg-purple-500 text-white px-3 py-1 rounded">
          Total Volunteers: {stats.totalVolunteers}
        </div>
        <div className="bg-green-500 text-white px-3 py-1 rounded">
          Total Questions: {stats.totalQuestions}
        </div>
        <div className="bg-yellow-500 text-white px-3 py-1 rounded">
          Total Messages: {stats.totalMessages}
        </div>
        <div className="bg-red-500 text-white px-3 py-1 rounded">
          Total Doubts: {stats.totalDoubts}
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
