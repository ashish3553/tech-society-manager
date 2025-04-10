import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function AnnouncementCard({ 
  announcement, 
  onEdit, 
  onDelete, 
  isEditable, 
  expandedMessages, 
  toggleMessage
}) {
  const [showLocalModal, setShowLocalModal] = useState(false);
  const [localEditedSubject, setLocalEditedSubject] = useState(announcement.subject);
  const [localEditedBody, setLocalEditedBody] = useState(announcement.body);
  const [localEditedLinks, setLocalEditedLinks] = useState(announcement.links?.join(',') || '');

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(announcement.createdAt);

  const handleEditClick = () => {
    setLocalEditedSubject(announcement.subject);
    setLocalEditedBody(announcement.body);
    setLocalEditedLinks(announcement.links?.join(',') || '');
    setShowLocalModal(true);
  };

  const handleConfirmEdit = () => {
    const updatedAnnouncement = {
      ...announcement,
      subject: localEditedSubject,
      body: localEditedBody,
      links: localEditedLinks.split(',').map(link => link.trim()).filter(Boolean)
    };
    onEdit(updatedAnnouncement);
    setShowLocalModal(false);
  };

  return (
    <>
      <tr className="hover:bg-gray-600">
        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{announcement.subject}</td>
        <td className="px-6 py-4 text-gray-300">
          {announcement.body.length > 100 ? (
            <>
              {expandedMessages[announcement._id] 
                ? announcement.body 
                : announcement.body.substring(0, 100) + '...'}
              <button 
                onClick={() => toggleMessage(announcement._id)}
                className="ml-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                {expandedMessages[announcement._id] ? 'Show Less' : 'See More'}
              </button>
            </>
          ) : (
            announcement.body
          )}
        </td>
        <td className="px-6 py-4">
          <div className="text-gray-300">{date}</div>
          <div className="text-gray-400 text-xs">{time}</div>
        </td>
        <td className="px-6 py-4">
          {announcement.links && announcement.links.length > 0 && (
            <a
              href={announcement.links[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium hover:underline inline-flex items-center"
            >
              Link
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </td>
        {isEditable && (
          <td className="px-6 py-4">
            <div className="flex space-x-2">
              <button onClick={handleEditClick} className="text-blue-500 hover:text-blue-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={() => onDelete(announcement._id)} className="text-red-500 hover:text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m6-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        )}
      </tr>

      {showLocalModal && ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit Announcement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={localEditedSubject}
                  onChange={(e) => setLocalEditedSubject(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Message</label>
                <textarea
                  value={localEditedBody}
                  onChange={(e) => setLocalEditedBody(e.target.value)}
                  className="w-full border rounded p-2"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Links (comma separated)</label>
                <input
                  type="text"
                  value={localEditedLinks}
                  onChange={(e) => setLocalEditedLinks(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowLocalModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default AnnouncementCard;
