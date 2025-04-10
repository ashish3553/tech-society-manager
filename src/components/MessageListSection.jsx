// src/components/MessageListSection.jsx
import React from 'react';
import MessageList from './MessageList';

function MessageListSection({ messages, onUpdate }) {
  return (
    <div className="rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">All Messages</h2>
      <MessageList messages={messages} onUpdate={onUpdate} />
    </div>
  );
}

export default MessageListSection;
