// src/components/AssignmentCard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function AssignmentCard({ assignment, onUpdate, onDelete, onRefresh }) {
  const { auth } = useContext(AuthContext);
  const currentUserId = auth?.user?.id;
  const currentUserRole = auth?.user?.role;

  // Local state for distribution tag (optimistic update)
  const [localTag, setLocalTag] = useState(assignment.distributionTag);
  // State for modal confirmation and pending tag update
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTag, setPendingTag] = useState('');

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
        return 'bg-yellow-500';
      case 'pw':
      case 'practice':
        return 'bg-blue-500';
      case 'hm':
        return 'bg-purple-500';
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
        return 'bg-yellow-500';
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
  const creator = assignment.createdBy;
  const modifier = assignment.lastModifiedBy;

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

  // Handler when a tag button is clicked
  const handleTagClick = (tag) => {
    // Set pending tag and open confirmation modal
    setPendingTag(tag);
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
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg transition-shadow duration-300 p-6 flex flex-col">
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
        {(currentUserRole === 'mentor' || currentUserRole === 'admin') && (
          <div className="text-sm text-gray-600">
            {creator && (
              <p>
                <strong>Created by:</strong> {creator.name} ({creator.role})
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

      {/* Distribution Buttons for Mentor/Admin */}
      {(currentUserRole === 'mentor' || currentUserRole === 'admin') && (
        <div className="mt-4 flex justify-around">
          <button
            type="button"
            onClick={() => handleTagClick('hw')}
            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
          >
            HW
          </button>
          <button
            type="button"
            onClick={() => handleTagClick('practice')}
            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
          >
            Practice
          </button>
          <button
            type="button"
            onClick={() => handleTagClick('cw')}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600"
          >
            CW
          </button>
        </div>
      )}

      {/* Footer Row */}
      <div className="mt-2 flex items-center justify-between border-t pt-2">
        <Link
          to={`/assignments/${assignment._id}`}
          className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700"
        >
          View Details
        </Link>
        <div className="flex items-center gap-2">
          {currentUserRole === 'student' && (
            <span className={`text-white text-xs px-2 py-1 rounded ${getResponseBadgeColor(studentResponse.responseStatus)}`}>
              {studentResponse.responseStatus}
            </span>
          )}
          <span className={`px-3 py-1 text-sm font-bold text-white ${getBadgeColor(localTag)}`}>
            {localTag.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Confirmation Modal for Tag Change */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-80">
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
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
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
