// src/components/RecipientCard.jsx
import React from 'react';

function RecipientCard({ recipient, onSelect }) {
  return (
    <div className="flex items-center border p-2 rounded hover:shadow-md transition-shadow duration-300">
      <input
        type="checkbox"
        onChange={(e) => onSelect(recipient._id, e.target.checked)}
        className="mr-2"
      />
      {recipient.profileImage ? (
        <img
          src={recipient.profileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-2 object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
          <span className="text-xs text-gray-500">No Img</span>
        </div>
      )}
      <div>
        <p className="font-medium">{recipient.name}</p>
        <p className="text-sm text-gray-600">{recipient.email}</p>
        <p className="text-sm text-gray-600">{recipient.role}</p>
      </div>
    </div>
  );
}

export default RecipientCard;
