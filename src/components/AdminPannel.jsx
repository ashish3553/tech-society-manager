// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminUserCard from './AdminUserCard';

function AdminPanel({ adminUsers, onDisable, onDelete }) {
  // A state to hold progress data for mentors by their ID.
  const [progressData, setProgressData] = useState({});

  // Function to fetch progress for a specific user
  const fetchProgress = async (userId) => {
    try {
      const res = await axios.get(`/api/goals/user/${userId}`);
      // Save the fetched progress for that user
      setProgressData((prev) => ({
        ...prev,
        [userId]: res.data,
      }));
    } catch (error) {
      console.error('Error fetching progress for user', userId, error);
    }
  };

  // Optionally, preload progress data for mentor users when the component mounts
  useEffect(() => {
    adminUsers.forEach((user) => {
      if (user.role === 'mentor') {
        fetchProgress(user._id);
      }
    });
  }, [adminUsers]);

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <div className="flex gap-4 mb-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-sm">
          Create Mentor
        </button>
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-sm">
          Create Admin
        </button>
        <button className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors text-sm">
          Create Volunteer
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminUsers.length === 0 ? (
          <p className="text-gray-500">No users available.</p>
        ) : (
          adminUsers.map((user) => (
            <AdminUserCard 
              key={user._id}
              user={user}
              progress={progressData[user._id]}
              fetchProgress={() => fetchProgress(user._id)}
              onDisable={onDisable}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
