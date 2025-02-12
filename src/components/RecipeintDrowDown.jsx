// src/components/RecipientDropdown.jsx
import React from 'react';

function RecipientDropdown({ recipients, onSelect }) {
  return (
    <div className="border rounded p-2 mt-2 bg-white shadow max-h-60 overflow-y-auto">
      {recipients.map((recipient) => (
        <div
          key={recipient._id}
          className="flex items-center p-1 hover:bg-gray-100 cursor-pointer"
        >
          <input
            type="checkbox"
            onChange={(e) => onSelect(recipient._id, e.target.checked)}
            className="mr-2"
          />
          <div>
            <p className="font-medium">{recipient.name}</p>
            <p className="text-xs text-gray-600">
              {recipient.email} - {recipient.role}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipientDropdown;
