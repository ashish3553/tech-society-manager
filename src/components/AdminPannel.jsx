// src/components/AdminPanel.jsx
import React from 'react';
import AdminUserCard from './AdminUserCard';

function AdminPanel({ adminUsers, onDisable, onDelete }) {
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
