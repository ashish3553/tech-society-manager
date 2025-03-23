// src/components/BriefingCard.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { HashLoader } from "react-spinners";


const BriefingCard = ({ briefing, onEdit, onDelete }) => {
  const { auth } = useContext(AuthContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false)

  console.log("Recieved Briefing is: ", briefing)

  // Helper: compute the display date
  const getDisplayDate = (item) => {
    if (!item) return '';
    const createdDate = new Date(item.createdAt);
    const updatedDate = item.updatedAt ? new Date(item.updatedAt) : null;
    const displayDate = updatedDate && updatedDate > createdDate ? updatedDate : createdDate;
    return displayDate.toLocaleString('en-IN');
  };

  // Determine if action buttons should be shown (for mentor, admin, or volunteer)
  const showActions =
    auth?.user?.role === 'mentor' ||
    auth?.user?.role === 'admin' ||
    auth?.user?.role === 'volunteer';

  // Handlers for deletion confirmation modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    if (onDelete) {
      onDelete();
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow flex flex-col relative min-h-[250px]">
      {/* Main Content Area */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-2 text-black">Class Briefing</h3>
        <div className="mb-2">
          <p className="font-semibold text-gray-700">Summary:</p>
          <p className="whitespace-pre-line text-gray-800">{briefing.classSummary}</p>
        </div>
        <div className="mb-2">
          <p className="font-semibold text-gray-700">Class Questions:</p>
          <p className="whitespace-pre-line text-gray-800">{briefing.classQuestions}</p>
        </div>
        <div className="mb-2">
          <p className="font-semibold text-gray-700">Homework Questions:</p>
          <p className="whitespace-pre-line text-gray-800">{briefing.homeworkQuestions}</p>
        </div>
      </div>

      {/* Footer: Action Buttons (if applicable) and Posted Info */}
      {showActions ? (
        <div className="mt-4 flex justify-between items-center border-t pt-2">
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
            {(auth.user.role === 'mentor' || auth.user.role === 'admin') && (
              <button
                onClick={handleDeleteClick}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          <div className="text-right text-sm text-gray-600">
            Posted by: {briefing.createdBy?.name} ({briefing.createdBy?.role})<br />
            Date: {getDisplayDate(briefing)}
          </div>
        </div>
      ) : (
        <div className="mt-4 text-right text-sm text-gray-600">
          Posted by: {briefing.createdBy?.name} ({briefing.createdBy?.role})<br />
          Date: {getDisplayDate(briefing)}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-80">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this briefing?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefingCard;
