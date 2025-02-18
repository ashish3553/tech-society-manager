// src/components/MentorProfile.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function MentorProfile() {
  const { auth } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalDoubtsReplied: 0,
    totalPersonalMessages: 0
  });

  useEffect(() => {
    const fetchMentorStats = async () => {
      try {
        // Backend should return an object with these statistics.
        const res = await api.get('/dashboard/mentor');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch mentor statistics.');
      }
    };
    fetchMentorStats();
  }, [auth]);

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-2">Mentor Profile</h2>
      <p><strong>Name:</strong> {auth.user.name}</p>
      <p><strong>Email:</strong> {auth.user.email}</p>
      <p><strong>Role:</strong> {auth.user.role}</p>
      <div className="flex flex-wrap gap-4 mt-4">
        <div className="bg-indigo-500 text-white px-3 py-1 rounded">
          Total Questions: {stats.totalQuestions}
        </div>
        <div className="bg-green-500 text-white px-3 py-1 rounded">
          Doubts Replied: {stats.totalDoubtsReplied}
        </div>
        <div className="bg-purple-500 text-white px-3 py-1 rounded">
          Personal Messages: {stats.totalPersonalMessages}
        </div>
      </div>
    </div>
  );
}

export default MentorProfile;
