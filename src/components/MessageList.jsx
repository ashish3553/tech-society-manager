// src/components/MessageList.jsx
import React from 'react';

function MessageList({ messages, onUpdate }) {
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg._id} className="bg-white p-4 rounded shadow">
          {/* Header: Subject and Sender */}
          <div>
            <h3 className="text-xl font-bold">{msg.subject}</h3>
          </div>
          {/* Message Body */}
          <p className="text-sm text-gray-700 mt-2">{msg.body}</p>
          {/* Footer: Recipients (if any), Date and Tag */}
          
          <p className="text-sm mt-4 text-gray-600"><spna className=" text-zinc-800 font-semibold ">Sent By: </spna> {msg.sender?.name || 'Unknown'}</p>

          <div className="mt-1 flex justify-between items-center">
            {msg.recipients && msg.recipients.length > 0 && (
              <p className="text-xs text-gray-500">
                <span className=" text-zinc-800 font-semibold text-sm">To:</span> {msg.recipients.map(r => r.name).join(', ')}
              </p>
            )}
            <div className="text-right">
              <span className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleString('en-IN')}
              </span>
              <span className="mt-1 ml-4">
                {msg.isPublic ? (
                  <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs">
                    Public
                  </span>
                ) : (
                  <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">
                    Personal
                  </span>
                )}
              </span>
            </div>
          </div>
          {/* Update Button */}
          {/* <div className="mt-2">
            <button
              onClick={() => onUpdate && onUpdate(msg)}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
            >
              Update
            </button>
          </div> */}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
