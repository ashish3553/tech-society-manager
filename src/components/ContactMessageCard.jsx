// src/components/ContactMessageCard.jsx
import React from 'react';

function ContactMessageCard({ message }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-bold mb-2">{message.name}</h3>
      <p className="text-sm text-gray-600 mb-1">{message.email}</p>
      <p className="text-base text-gray-800 mb-2">{message.message}</p>
      <p className="text-xs text-gray-500">
        {new Date(message.createdAt).toLocaleString('en-IN')}
      </p>
    </div>
  );
}

export default ContactMessageCard;
