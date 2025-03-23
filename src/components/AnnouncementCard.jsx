// src/components/AnnouncementCard.jsx
import React, { useState } from 'react';

function AnnouncementCard({ announcement, onEdit, onDelete, isEditable = false }) {
  const displayDate = new Date(announcement.createdAt).toLocaleString('en-IN');
  const [showModal, setShowModal] = useState(false);
  // Local state for edited fields
  const [editedSubject, setEditedSubject] = useState(announcement.subject);
  const [editedBody, setEditedBody] = useState(announcement.body);
  const [editedLinks, setEditedLinks] = useState(announcement.links?.join(', ') || '');

  // Open the edit modal and initialize state from announcement data
  const handleEditClick = () => {
    setEditedSubject(announcement.subject);
    setEditedBody(announcement.body);
    setEditedLinks(announcement.links?.join(', ') || '');
    setShowModal(true);
  };

  // Cancel editing and close modal
  const cancelModal = () => {
    setShowModal(false);
  };


  // Save changes and trigger onEdit callback with updated announcement data
  const confirmEdit = () => {
    // Create an updated announcement object
    const updatedAnnouncement = {
      ...announcement,
      subject: editedSubject,
      body: editedBody,
      // Convert links string into an array (split by comma)
      links: editedLinks.split(',').map(link => link.trim()).filter(link => link)
    };
    onEdit(updatedAnnouncement);
    setShowModal(false);
  };

  return (
    <>
      <div className="w-full p-6 bg-white border border-yellow-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <p className="text-gray-800 text-2xl font-bold mb-3">
          {announcement.subject}
        </p>
        <p className="text-gray-600 text-base mb-4 leading-relaxed">{announcement.body}</p>
        {announcement.links && announcement.links.length > 0 && (
          <p className="mb-4">
            <span className="font-medium text-gray-700 mr-2">Link:</span>
            <a
              href={announcement.links[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center"
            >
              Click here
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </p>
        )}
        <div className="flex justify-between items-center space-x-2">
          <div className="flex space-x-2">
            {isEditable && (
              <>
                <button onClick={handleEditClick}>
                  {/* Edit Icon */}
                  <svg
                    className="w-6 h-6 text-blue-500 hover:text-blue-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 4H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-6M16 3l5 5-9 9H7v-5l9-9z"
                    />
                  </svg>
                </button>
                <button onClick={() => onDelete(announcement._id)}>
                  {/* Delete Icon */}
                  <svg
                    className="w-6 h-6 text-red-500 hover:text-red-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 012 2v1H7V9a2 2 0 012-2h6z"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
          <p className="text-xs text-right text-gray-500">{displayDate}</p>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit Announcement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Message</label>
                <textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  className="w-full border rounded p-2"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Links (comma separated)</label>
                <input
                  type="text"
                  value={editedLinks}
                  onChange={(e) => setEditedLinks(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={cancelModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AnnouncementCard;
