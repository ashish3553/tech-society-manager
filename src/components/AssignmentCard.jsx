// src/components/AssignmentCard.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AssignmentCard({ assignment, onUpdate, onDelete }) {
  const { auth } = useContext(AuthContext);
  const currentUserId = auth?.user?.id;
  const currentUserRole = auth?.user?.role;

  console.log("Assigned by " ,assignment)
  // Default student response if not found.
  let studentResponse = { responseStatus: 'not attempted' };
  if (currentUserId && assignment.responses && assignment.responses.length > 0) {
    const found = assignment.responses.find((resp) => {
      const studentId =
        typeof resp.student === 'object' && resp.student !== null && resp.student._id
          ? String(resp.student._id)
          : String(resp.student);
      return studentId === String(currentUserId);
    });
    if (found) {
      studentResponse = {
        responseStatus: found.responseStatus || 'not attempted',
        learningNotes: found.learningNotes || '',
        submissionUrl: found.submissionUrl || '',
        screenshots: found.screenshots || []
      };
    }
  }

  // Function to choose badge color for the assignment tag
  const getAssignmentTagColor = (tag) => {
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

  // Function to choose response badge color based on status
  const getResponseBadgeColor = (status) => {
    switch (status) {
      case 'solved':
        return 'bg-green-500';
      case 'partially solved':
        return 'bg-yellow-500';
      case 'having doubt':
      case 'not understanding':
        return 'bg-red-500';
      case 'not attempted':
      default:
        return 'bg-gray-500';
    }
  };

  // Compute display date: choose updatedAt if it exists and is later than createdAt.
  const createdDate = assignment.createdAt ? new Date(assignment.createdAt) : null;
  const updatedDate = assignment.updatedAt ? new Date(assignment.updatedAt) : null;
  const displayDate = updatedDate && updatedDate > createdDate ? updatedDate : createdDate;
  const formattedDate = displayDate ? displayDate.toLocaleString('en-IN') : '';

  // Determine mentor (poster) info:
  // If assignment.assignedBy is provided, use that; otherwise, fall back to createdBy/updatedBy.
  let mentorInfo = assignment.assignedBy;
  console.log("mentor info is:", mentorInfo)
  if (!mentorInfo && (assignment.updatedBy || assignment.createdBy)) {
    mentorInfo = assignment.updatedBy || assignment.createdBy;
    console.log("Now mentor info is:",mentorInfo)
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col">
      {/* Assignment Tag Sticker */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <span className={`px-3 py-1 text-sm font-bold text-white ${getAssignmentTagColor(assignment.assignmentTag)}`}>
          {assignment.assignmentTag.toUpperCase()}
        </span>
      </div>

      {/* Update/Delete Buttons for Mentor/Admin */}
      {(currentUserRole === 'mentor' || currentUserRole === 'admin') && (
        <div className="absolute top-2 right-4 flex gap-2">
          <button
            onClick={() => onUpdate && onUpdate(assignment)}
            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
          >
            Update
          </button>
          {currentUserRole === 'admin' && (
            <button
              onClick={() => onDelete && onDelete(assignment._id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-3">
        <h2 className="text-2xl font-extrabold text-indigo-700">{assignment.title}</h2>
        {assignment.tags && assignment.tags.length > 0 && (
          <p className="text-sm text-gray-600">
            <strong>Tags:</strong> {assignment.tags.join(', ')}
          </p>
        )}
        <p className="text-sm text-gray-600">
          <strong>Difficulty:</strong> {assignment.difficulty}
        </p>
        {/* Display mentor info for all users when available */}

        {console.log(mentorInfo, "this ine")}
        {mentorInfo ? (
  <div className="text-sm text-gray-600">
    <strong>Mentor:</strong> {mentorInfo.name} ({mentorInfo.role || 'N/A'})
    
    
  </div>
) : (
  <p className="text-sm text-gray-600">No mentor info available.</p>
)}
      </div>

      {/* Sticky Footer */}
      <div className="mt-auto border-t pt-3 flex flex-col sm:flex-row items-center justify-between">
        <Link to={`/assignments/${assignment._id}`} className="text-indigo-600 font-semibold hover:underline">
          View Details
        </Link>
        <div className="flex items-center gap-2">
          <span className={`text-white text-xs px-2 py-1 rounded ${getResponseBadgeColor(studentResponse.responseStatus)}`}>
            {studentResponse.responseStatus}
          </span>
          <span className="text-gray-500 text-xs">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

export default AssignmentCard;
