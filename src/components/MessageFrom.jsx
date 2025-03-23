// src/components/MessageForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

function MessageForm() {
  const [messageData, setMessageData] = useState({
    subject: '',
    body: '',
    isPublic: true,
    recipients: [],
    links: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageData.isPublic && messageData.recipients.length === 0) {
      toast.warning('Please select at least one recipient for a personal message.');
      return;
    }
    try {
      const payload = {
        subject: messageData.subject,
        body: messageData.body,
        isPublic: messageData.isPublic,
        recipients: messageData.isPublic ? [] : messageData.recipients,
        links: messageData.links
          ? messageData.links.split(',').map(link => link.trim()).filter(link => link)
          : []
      };
      await api.post('/messages', payload);
      toast.success('Message sent successfully!');
      setMessageData({
        subject: '',
        body: '',
        isPublic: true,
        recipients: [],
        links: ''
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message.');
    }
  };

  return (
    <div className=" rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Create Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Subject:</label>
          <input 
            type="text"
            name="subject"
            className="w-full border rounded p-2"
            value={messageData.subject}
            onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Message:</label>
          <textarea 
            name="body"
            className="w-full border rounded p-2"
            value={messageData.body}
            onChange={(e) => setMessageData({ ...messageData, body: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Message Type:</label>
          <select 
            name="isPublic"
            className="w-full border rounded p-2"
            value={messageData.isPublic ? "public" : "personal"}
            onChange={(e) => setMessageData({ 
              ...messageData, 
              isPublic: e.target.value === "public" 
            })}
            required
          >
            <option value="public">Public Message</option>
            <option value="personal">Personal Message</option>
          </select>
        </div>
        {!messageData.isPublic && (
          <div>
            <label className="block font-medium mb-1">Recipients:</label>
            <input 
              type="text"
              name="recipients"
              className="w-full border rounded p-2"
              value={messageData.recipients}
              onChange={(e) => setMessageData({ ...messageData, recipients: e.target.value.split(',').map(email => email.trim()) })}
              placeholder="Enter recipient emails, separated by commas"
              required
            />
          </div>
        )}
        <div>
          <label className="block font-medium mb-1">Links (Optional):</label>
          <input 
            type="text"
            name="links"
            className="w-full border rounded p-2"
            value={messageData.links}
            onChange={(e) => setMessageData({ ...messageData, links: e.target.value })}
            placeholder="Enter link(s), separated by commas"
          />
        </div>
        <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
          Send Message
        </button>
      </form>
    </div>
  );
}

export default MessageForm;
