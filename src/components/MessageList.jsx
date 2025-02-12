// src/components/MessageList.jsx
import React from 'react';

function MessageList({ messages, onUpdate }) {
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg._id} className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{msg.subject}</h3>
            <button
              onClick={() => onUpdate && onUpdate(msg)}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
            >
              Update
            </button>
          </div>
          <p className="text-sm text-gray-700">{msg.body}</p>
          <div className="text-xs text-gray-500 mt-2 flex flex-wrap items-center gap-2">
            <span>{new Date(msg.createdAt).toLocaleString('en-IN')}</span>
            {msg.isPublic ? (
              <span className="bg-blue-500 text-white px-2 rounded">Public</span>
            ) : (
              <span className="bg-red-500 text-white px-2 rounded">Personal</span>
            )}
            {msg.recipients && msg.recipients.length > 0 && (
              <span>Recipients: {msg.recipients.join(', ')}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
