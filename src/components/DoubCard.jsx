// src/components/DoubtCard.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function DoubtCard({ doubt }) {
  const { auth } = useContext(AuthContext);

  // Get the student name from the doubt's student field (populated or not)
  const studentName = doubt.student && typeof doubt.student === 'object' ? doubt.student.name : "Unknown";
const studentBranch = doubt.student && typeof doubt.student === 'object' ? doubt.student.branch || 'N/A' : 'N/A';


// Compute last mentor reply:
let lastReply = null;
if (doubt.conversation && doubt.conversation.length > 0) {
  const replies = doubt.conversation.filter(entry => entry.type === 'reply');
  if (replies.length > 0) {
    lastReply = replies[replies.length - 1];
  }
}

  // Format creation date/time
  const createdDate = doubt.createdAt
    ? new Date(doubt.createdAt).toLocaleString()
    : '';

  // Extract assignment tag (for category display)
  const category = doubt.assignment && doubt.assignment.assignmentTag
    ? doubt.assignment.assignmentTag.toLowerCase()
    : "n/a";

  // Function to choose a background color based on the assignment category
  const getCategoryBadgeColor = (tag) => {
    switch (tag.toLowerCase()) {
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

  // Function to choose a badge color based on the doubt's current status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-gray-500';
      case 'replied':
        return 'bg-blue-500';
      case 'unsatisfied':
        return 'bg-orange-500';
      case 'review':
        return 'bg-purple-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Use doubt.currentStatus (if available) to display the dynamic tag.
  // Fallback to "unresolved" if currentStatus is not defined.
  const currentStatus =
    doubt.currentStatus || (doubt.resolved ? 'resolved' : 'unresolved');

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
            <strong>Raised By:</strong> {studentName} ({studentBranch})
          </p>
          {lastReply && lastReply.sender && (
            <p className="text-sm text-gray-700 mb-2">
              <strong>Replied by:</strong> {lastReply.sender.name} ({lastReply.sender.role})
            </p>
          )}

      {/* Doubt Text (trimmed using line-clamp) */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {doubt.doubtText}
      </p>

      {/* Sticky Footer: View Details link, dynamic status tag, and date */}
      <div className="mt-auto flex items-center justify-between border-t pt-2">
        <Link to={`/doubts/${doubt._id}`} className="text-indigo-600 font-semibold hover:underline">
          View Details
        </Link>
        <span className={`text-white text-xs px-2 py-1 rounded ${getStatusBadgeColor(currentStatus)}`}>
          {currentStatus.toUpperCase()}
        </span>
        <span className="text-green-600 text-xs">
          {createdDate}
        </span>
      </div>
    </div>
  );
}

export default DoubtCard;
