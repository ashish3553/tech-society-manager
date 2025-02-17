// src/components/MessageCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function MessageCard({ message }) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col">
      {/* Tag Badge */}
      <div className="absolute top-3 right-3">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${message.isPublic ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
          {message.isPublic ? 'Public' : 'Personal'}
        </span>
      </div>

      {/* Message Subject */}
      <h3 className="text-2xl font-extrabold text-indigo-700 mb-3">
        {message.subject}
      </h3>

      {/* Message Body */}
      <p className="text-base text-gray-800 mb-4 line-clamp-3">
        {message.body}
      </p>

      {/* Display Links if available */}
      {message.links && message.links.length > 0 && (
        <div className="mb-4">
          <p className="font-bold text-blue-600 text-base mb-1">Links:</p>
          <ul className="list-disc list-inside space-y-1">
            {message.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 font-semibold hover:underline"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Section */}
      <div className="mt-auto border-t pt-3 flex flex-col">
        <p className="text-sm text-gray-600">
          <span className="font-medium">From:</span> {message.sender?.name || 'Unknown'} ({message.sender?.email || 'N/A'})
        </p>
        {message.isPublic ? (
          <p className="text-sm text-gray-600">
            <span className="font-medium">To:</span> Global
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            <span className="font-medium">To:</span> {message.recipients?.map(r => `${r.name} (${r.email})`).join(', ')}
          </p>
        )}
        <p className="text-sm text-gray-500">
          <span className="font-medium">Date:</span> {new Date(message.createdAt).toLocaleString('en-IN')}
        </p>
        <Link to={`/messages/${message._id}`} className="mt-2 text-blue-600 hover:underline">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default MessageCard;
