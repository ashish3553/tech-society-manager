// src/components/AssignmentCard.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function AssignmentCard({ assignment, onUpdate, onDelete, onRefresh }) {
  const { auth } = useContext(AuthContext);
  const currentUserId = auth?.user?.id;
  const currentUserRole = auth?.user?.role;
  console.log("Here is your assignment: ", assignment);

  // Local state for distribution tag (optimistic update)
  const [localTag, setLocalTag] = useState(assignment.distributionTag);
  // State for modal confirmation and pending tag update
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTag, setPendingTag] = useState('');
  // State for tag dropdown menu
  const [showTagMenu, setShowTagMenu] = useState(false);

   // Ref for the dropdown container
   const dropdownRef = useRef(null);

    // Close dropdown when clicking outside of it
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowTagMenu(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

  // When the assignment prop changes, update localTag
  useEffect(() => {
    setLocalTag(assignment.distributionTag);
  }, [assignment.distributionTag]);

  // Determine student's response (for student view)
  let studentResponse = { responseStatus: 'Unattempted' };
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
        responseStatus: found.responseStatus || 'Unattempted',
        learningNotes: found.learningNotes || '',
        submissionUrl: found.submissionUrl || '',
        screenshots: found.screenshots || []
      };
    }
  }

  // Helper: get badge color based on distribution tag.
  const getBadgeColor = (tag) => {
    switch (tag.toLowerCase()) {
      case 'central':
        return 'bg-gray-600';
      case 'hw':
        return 'bg-red-500';
      case 'cw':
        return 'bg-yellow-900';
      case 'pw':
      case 'practice':
        return 'bg-blue-500';
      case 'hm':
        return 'bg-green-900';
      case 'personal':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Helper: response badge color.
  const getResponseBadgeColor = (status) => {
    switch (status) {
      case 'solved':
        return 'bg-green-500';
      case 'partially solved':
        return 'bg-yellow-800';
      case 'having doubt':
      case 'not understanding':
        return 'bg-red-500';
      case 'not attempted':
      default:
        return 'bg-gray-500';
    }
  };

  // Compute display date (prefer updatedAt over createdAt if available)
  const createdDate = assignment.createdAt ? new Date(assignment.createdAt) : null;
  const updatedDate = assignment.updatedAt ? new Date(assignment.updatedAt) : null;
  const displayDate = updatedDate && updatedDate > createdDate ? updatedDate : createdDate;
  const formattedDate = displayDate ? displayDate.toLocaleString('en-IN') : '';

  // Mentor tracking info
  const creator = assignment.createdBy.name;
  const modifier = assignment.lastModifiedBy.name;

  console.log("name and role info", assignment, creator)

  // Optimistic UI update: call this function to update distribution tag after confirmation.
  const updateTag = async (newTag) => {
    const previousTag = localTag;
    setLocalTag(newTag);
    try {
      await api.put(`/assignments/${assignment._id}/distribution`, { distributionTag: newTag });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating distribution tag:", error);
      setLocalTag(previousTag);
    }
  };

  // Handler when a tag option is clicked from dropdown
  const handleTagClick = (tag) => {
    setPendingTag(tag);
    setShowTagMenu(false);
    setShowConfirmModal(true);
  };

  // When mentor confirms modal
  const confirmTagChange = () => {
    updateTag(pendingTag);
    setShowConfirmModal(false);
  };

  // When mentor cancels modal
  const cancelTagChange = () => {
    setShowConfirmModal(false);
    setPendingTag('');
  };

  return (
    <div className="relative border border-gray-200 rounded-lg shadow-lg transition-shadow duration-300 p-6 flex flex-col">
      {/* Main Content */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold ">{assignment.title}</h2>
        {assignment.tags && assignment.tags.length > 0 && (
          <p className="text-sm font-medium text-gray-400">
            <strong>Tags:</strong> {assignment.tags.join(', ')}
          </p>
        )}
        <p className="text-sm font-medium text-gray-400">
          <strong>Difficulty:</strong> {assignment.difficulty}
        </p>
        {(currentUserRole === 'mentor' || currentUserRole === 'admin') && (
          <div className="text-sm text-gray-600">
            {creator && (
              <p>
                <strong>Created by:</strong> {creator}
              </p>
            )}
            {creator &&
              modifier &&
              creator._id &&
              modifier._id &&
              modifier._id.toString() !== creator._id.toString() && (
                <p>
                  <strong>Last Edited by:</strong> {modifier.name} ({modifier.role})
                </p>
              )}
          </div>
        )}
      </div>

      {/* Three Dot Icon for Distribution Options (Mentor/Admin) */}
      {(currentUserRole === 'mentor' || currentUserRole === 'admin') && (
        <div className="absolute bottom-2 right-2 " ref={dropdownRef}>
          <button
            onClick={() => setShowTagMenu((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            {/* Three-dot icon */}
            <svg
              className="w-6 h-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
          {showTagMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-32  border border-gray-200 rounded shadow-lg z-10">
              <button
                onClick={() => handleTagClick('hw')}
                className="w-full text-left px-4 py-2 hover:bg-gray-600"
              >
                HW
              </button>
              <button
                onClick={() => handleTagClick('practice')}
                className="w-full text-left px-4 py-2 hover:bg-gray-600"
              >
                Practice
              </button>
              <button
                onClick={() => handleTagClick('cw')}
                className="w-full text-left px-4 py-2 hover:bg-gray-600"
              >
                CW
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer Row */}
      <div className="mt-2 flex items-center justify-between border-t pt-2">
        <Link
          to={`/assignments/${assignment._id}`}
          className="bg-indigo-500 text-white font-medium px-3 py-1 rounded text-xs hover:bg-indigo-700"
        >
          View Details
        </Link>
        <div className="flex items-center gap-2">
          {(currentUserRole === 'student' || currentUserRole === 'volunteer') && (
            <span className={`text-white text-xs px-2 py-1 rounded ${getResponseBadgeColor(studentResponse.responseStatus)}`}>
              {studentResponse.responseStatus}
            </span>
          )}
          <span className={`px-1 absolute top-1 right-1 rounded-md py-0 text-sm font-bold text-white ${getBadgeColor(localTag)}`}>
            {localTag.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Confirmation Modal for Tag Change */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 z-50">
          <div className=" rounded p-6 w-80">
            <h2 className="text-xl font-bold mb-4">
              Confirm Tag Change
            </h2>
            <p className="mb-4">
              Are you sure you want to mark this assignment as <span className="font-semibold">{pendingTag.toUpperCase()}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelTagChange}
                className="bg-gray-600 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmTagChange}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignmentCard;
