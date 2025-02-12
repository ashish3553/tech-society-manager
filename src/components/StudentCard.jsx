// src/components/StudentCard.jsx
import React from 'react';

function StudentCard({ student, onUpdate, onDelete }) {
  // The student object is expected to have the following properties:
  // name, email, branch, year, role, profileImage, solvedCount, pendingHW

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow duration-300">
      {/* Student Basic Info */}
      <div className="flex items-center space-x-4">
        {student.profileImage ? (
          <img
            src={student.profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-500">No Img</span>
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-indigo-700">{student.name}</h3>
          <p className="text-sm text-gray-600">{student.email}</p>
          <p className="text-sm text-gray-600">{student.branch}, {student.year}</p>
          <p className="text-sm text-gray-600">Role: {student.role}</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mt-4 border-t pt-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700">Solved:</span>
          <span className="text-sm text-gray-600">{student.solvedCount || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700">Pending HW:</span>
          <span className="text-sm text-gray-600">{student.pendingHW || 0}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onUpdate && onUpdate(student)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors text-sm"
        >
          Update
        </button>
        <button
          onClick={() => onDelete && onDelete(student._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
