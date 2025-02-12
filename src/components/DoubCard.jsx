// src/components/DoubtCard.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function DoubtCard({ doubt }) {
  const { auth } = useContext(AuthContext);
  // Get the student name from the doubt's student field (populated or not)
  const studentName = doubt.student && typeof doubt.student === 'object' 
    ? doubt.student.name 
    : "Unknown";
  
  // Format creation date/time
  const createdDate = doubt.createdAt 
    ? new Date(doubt.createdAt).toLocaleString() 
    : '';

  // Extract assignment tag for category display (if assignment is populated)
  const category = doubt.assignment && doubt.assignment.assignmentTag
    ? doubt.assignment.assignmentTag.toLowerCase()
    : "n/a";

  // Function to choose a background color based on category
  const getCategoryBadgeColor = (tag) => {
    switch (tag) {
      case 'hw':
        return 'bg-red-500';
      case 'cw':
        return 'bg-yellow-500';
      case 'practice':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Determine the resolution status badge
  const isResolved = doubt.resolved;
  const statusBadgeColor = isResolved ? 'bg-green-500' : 'bg-gray-500';

  // We use CSS for trimming the doubt text (using Tailwind's line-clamp plugin).
  // Ensure you have installed @tailwindcss/line-clamp.
  // If not, you can alternatively add a custom class.
  return (
    <div className="relative bg-white rounded shadow p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col">
      {/* Top Section: Assignment Title and Category Badge */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold">
          {doubt.assignment ? doubt.assignment.title : "Assignment Title Unavailable"}
        </h3>
        <span className={`text-white text-xs px-2 py-1 rounded ${getCategoryBadgeColor(category)}`}>
          {category.toUpperCase()}
        </span>
      </div>

      {/* Student Info */}
      <p className="text-sm text-gray-700 mb-2">
        <strong>Raised By:</strong> {studentName}
      </p>

      {/* Doubt Text (trimmed) */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {doubt.doubtText}
      </p>

      {/* Sticky Bottom Section */}
      <div className="mt-auto flex items-center justify-between border-t pt-2">
        <Link to={`/doubts/${doubt._id}`} className="text-blue-600 hover:underline">
          View Details
        </Link>
        <span className={`text-white text-xs px-2 py-1 rounded ${statusBadgeColor}`}>
          {isResolved ? 'Resolved' : 'Unresolved'}
        </span>
        <span className="text-green-600 text-xs">
          {createdDate}
        </span>
      </div>
    </div>
  );
}

export default DoubtCard;
