// src/components/BriefingCard.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { HashLoader } from "react-spinners";
import ReactDOM from 'react-dom';

const BriefingCard = ({ briefing, onEdit, onDelete, loading }) => {
  const { auth } = useContext(AuthContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedBriefing, setEditedBriefing] = useState(null);

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

  const handleEditClick = () => {
    setEditedBriefing({ ...briefing });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    onEdit(editedBriefing);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="p-6 rounded border bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700 
        shadow-lg hover:shadow-2xl hover:shadow-teal-500/10 
        hover:border-teal-500/30 hover:scale-[1.02] 
        hover:-translate-y-1 
        transition-all duration-300 ease-out 
        flex flex-col relative min-h-[250px]
        hover:bg-gradient-to-br hover:from-zinc-800 hover:via-zinc-900 hover:to-zinc-800">
        {/* Main Content Area */}
        <div className="flex-grow">
          <h3 className="text-xl font-bold mb-2 text-zinc-100">Class Briefing</h3>
          <div className="mb-4">
            <p className="font-medium text-teal-200/80 mb-1">Summary:</p>
            <p className="whitespace-pre-line text-zinc-200">{briefing.classSummary}</p>
          </div>
          <div className="mb-4">
            <p className="font-medium text-teal-200/80 mb-1">Class Questions:</p>
            <p className="whitespace-pre-line text-zinc-200">{briefing.classQuestions}</p>
          </div>
          <div className="mb-4">
            <p className="font-medium text-teal-200/80 mb-1">Homework Questions:</p>
            <p className="whitespace-pre-line text-zinc-200">{briefing.homeworkQuestions}</p>
          </div>
        </div>

        {/* Footer */}
        {showActions ? (
          <div className="mt-4 flex justify-between items-center border-t border-zinc-700/50 pt-2">
            <div className="flex gap-2">
              <button
                onClick={handleEditClick}
                className="bg-teal-800/80 text-zinc-100 px-4 py-2 rounded hover:bg-teal-700 transition-all duration-300"
              >
                Edit
              </button>
              {(auth.user.role === 'mentor' || auth.user.role === 'admin') && (
                <button
                  onClick={handleDeleteClick}
                  className="bg-zinc-700/80 text-zinc-100 px-4 py-2 rounded hover:bg-zinc-600 transition-all duration-300"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="text-right text-sm text-zinc-400">
              Posted by: <span className="text-teal-200/90">{briefing.createdBy?.name}</span> 
              (<span className="text-zinc-300">{briefing.createdBy?.role}</span>)<br />
              Date: <span className="text-zinc-400">{getDisplayDate(briefing)}</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-right text-sm text-zinc-400">
            Posted by: <span className="text-teal-200/90">{briefing.createdBy?.name}</span>
            (<span className="text-zinc-300">{briefing.createdBy?.role}</span>)<br />
            Date: <span className="text-zinc-400">{getDisplayDate(briefing)}</span>
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

      {/* Edit Modal */}
      {showEditModal && editedBriefing && ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit Briefing</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Class Summary:</label>
                <textarea
                  className="w-full border rounded p-2"
                  value={editedBriefing.classSummary}
                  onChange={(e) =>
                    setEditedBriefing({
                      ...editedBriefing,
                      classSummary: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Class Questions:</label>
                <textarea
                  className="w-full border rounded p-2"
                  value={editedBriefing.classQuestions}
                  onChange={(e) =>
                    setEditedBriefing({
                      ...editedBriefing,
                      classQuestions: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Homework Questions:</label>
                <textarea
                  className="w-full border rounded p-2"
                  value={editedBriefing.homeworkQuestions}
                  onChange={(e) =>
                    setEditedBriefing({
                      ...editedBriefing,
                      homeworkQuestions: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  {loading ? <HashLoader size={35} color="white" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default BriefingCard;
