// src/components/MessageCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function MessageCard({ message,isHome }) {
  return (
    <div className="relative border bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700 
      shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 
      hover:border-indigo-500/30 hover:scale-[1.02] 
      hover:-translate-y-1 
      transition-all duration-300 ease-out 
      rounded-lg p-6 flex flex-col
      hover:bg-gradient-to-br hover:from-zinc-800 hover:via-zinc-900 hover:to-zinc-800">
      {/* Tag Badge */}
      {!isHome && <div className="absolute top-3 right-3">
        <span className={`px-2 py-1 text-xs  font-semibold rounded-full ${message.isPublic ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
          {message.isPublic ? 'Public' : 'Personal'}
        </span>
      </div>}

      {/* Message Subject */}
      <h3 className="text-2xl font-extrabold text-indigo-700 mb-2">
        {message.subject}
      </h3>

      {/* Message Body */}
      <p className="text-base text-gray-300 mb-4 line-clamp-3">
        {message.body}
      </p>

      {/* Display Links if available */}
      {message.links && message.links.length > 0 && (
        <div className="mb-4">
          <p className="font-bold text-blue-600 text-base mb-1">Links:</p>
          <ul className="list-none list-inside space-y-1">
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
      <div className="mt-auto border-t pt-1 flex flex-col">
        <p className="text-sm text-gray-600">
          <span className="font-medium">From:</span> {message.sender?.name || 'Unknown'} ({message.sender?.role || 'N/A'})
        </p>
        {  message.isPublic ? (
         !isHome &&  <p className="text-sm text-gray-600">
            <span className="font-medium">To:</span> Global
          </p>
        ) : (
          !isHome && <p className="text-sm text-gray-600">
            <span className="font-medium">To:</span> {message.recipients?.map(r => `${r.name} (${r.email})`).join(', ')}
          </p>
        )}
        <p className="text-sm text-gray-500">
          <span className="font-medium">Date:</span> {new Date(message.createdAt).toLocaleString('en-IN')}
        </p>
        {/* will see in future if needed */}
        {/* <Link to={`/messages/${message._id}`} className="mt-2 text-blue-600 hover:underline">
          View Details
        </Link> */}
      </div>
    </div>
  );
}

export default MessageCard;
