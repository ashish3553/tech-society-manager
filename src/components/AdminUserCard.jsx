// src/components/AdminUserCard.jsx
import React, { useState } from 'react';

function AdminUserCard({ user, onDisable, onDelete }) {
  const [disableHours, setDisableHours] = useState('');

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow duration-300">
      {/* User Basic Info */}
      <div className="flex items-center space-x-4">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-500">No Img</span>
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-indigo-700">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">{user.branch}, {user.year}</p>
          <p className="text-sm text-gray-600">Role: {user.role}</p>
        </div>
      </div>
      {/* Admin Actions */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center">
          <input
            type="number"
            placeholder="Hours to disable"
            value={disableHours}
            onChange={(e) => setDisableHours(e.target.value)}
            className="w-24 border rounded p-1 mr-2"
          />
          <button
            onClick={() => onDisable(user._id, disableHours)}
            className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition-colors text-sm"
          >
            Disable
          </button>
        </div>
        <button
          onClick={() => onDelete(user._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default AdminUserCard;
