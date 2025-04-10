// src/components/AdminUserCard.jsx
import React, { useState } from 'react';

function AdminUserCard({ user, progress, fetchProgress, onDisable, onDelete }) {
  const [disableHours, setDisableHours] = useState('');
  const [showProgress, setShowProgress] = useState(false);

  // Toggle progress view and trigger a fetch if needed
  const toggleProgress = () => {
    if (!showProgress && !progress && typeof fetchProgress === 'function') {
      fetchProgress();
    }
    setShowProgress((prev) => !prev);
  };

  return (
    <div className="border-pink-200 border-2 p-4 rounded shadow hover:shadow-lg transition-shadow duration-300">
      {/* User Basic Info */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center animate-pulse">
          <span className="text-2xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-indigo-700">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">
            {user.branch}, {user.year}
          </p>
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
        
        {/* Mentor Progress Section */}
        {user.role === 'mentor' && (
          <>
            <button
              onClick={toggleProgress}
              className="mt-4 bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition-colors text-sm"
            >
              {showProgress ? 'Hide Progress' : 'Show Progress'}
            </button>
            {showProgress && (
              <div className="mt-2 bg-gray-50 p-2 rounded">
                {progress ? (
                  <>
                    <p className="font-semibold">Weekly Target:</p>
                    <p>{progress.weeklyTarget}</p>
                    <p className="mt-2 font-semibold">Daily Reports:</p>
                    <ul className="list-disc list-inside text-sm">
                      {progress.dailyReports && progress.dailyReports.length > 0 ? (
                        progress.dailyReports.map((report, idx) => (
                          <li key={idx}>
                            {new Date(report.date).toLocaleDateString()}: {report.update} {report.isCompleted ? '(Completed)' : ''}
                          </li>
                        ))
                      ) : (
                        <li>No daily reports yet.</li>
                      )}
                    </ul>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">Loading progress...</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminUserCard;
