// src/components/StudentMessageForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import RecipientDropdown from './RecipeintDrowDown';

function StudentMessageForm({ onClose }) {
  const [messageData, setMessageData] = useState({
    subject: '',
    body: '',
    isPublic: true,
    recipients: [],
    links: ''
  });
  const [recipientsList, setRecipientsList] = useState([]);
  // New state to control the dropdown visibility for recipients
  const [showRecipientsDropdown, setShowRecipientsDropdown] = useState(false);

  // Fetch the list of mentors, volunteers, and admins for recipient selection
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        // Fetch all users and then filter by roles
        const res = await api.get('/users');
        // Filter out students; keep mentors, volunteers, and admins.
        const filtered = res.data.filter(
          (user) =>
            user.role === 'mentor' ||
            user.role === 'volunteer' ||
            user.role === 'admin'
        );
        setRecipientsList(filtered);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch recipients.');
      }
    };
    fetchRecipients();
  }, []);

  const handleRecipientSelect = (userId, isChecked) => {
    setMessageData((prevData) => {
      let updated = prevData.recipients;
      if (isChecked) {
        // Only add if not already in the recipients array
        if (!updated.includes(userId)) {
          updated = [...updated, userId];
        }
      } else {
        updated = updated.filter((id) => id !== userId);
      }
      return { ...prevData, recipients: updated };
    });
  };
  

  // Handler for confirming the selection in the dropdown
  const confirmRecipients = () => {
    setShowRecipientsDropdown(false);
    toast.success('Recipients selected.');
  };

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
          ? messageData.links.split(',').map((link) => link.trim()).filter((link) => link)
          : []
      };

      console.log("Sending message to :", payload);
      await api.post('/messages', payload);
      toast.success('Message sent successfully!');
      setMessageData({
        subject: '',
        body: '',
        isPublic: true,
        recipients: [],
        links: ''
      });
      onClose && onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message.');
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Send Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Subject:</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={messageData.subject}
            onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Message:</label>
          <textarea
            className="w-full border rounded p-2"
            value={messageData.body}
            onChange={(e) => setMessageData({ ...messageData, body: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Message Type:</label>
          <select
            className="w-full border rounded p-2"
            value={messageData.isPublic ? "public" : "personal"}
            onChange={(e) => setMessageData({ ...messageData, isPublic: e.target.value === "public" })}
            required
          >
            <option value="public">Public Message</option>
            <option value="personal">Personal Message</option>
          </select>
        </div>
        {/* Render recipients dropdown only when message is personal */}
        {!messageData.isPublic && (
          <div>
            <label className="block font-medium mb-1">Select Recipients:</label>
            {/* Button to toggle the recipients dropdown */}
            {!showRecipientsDropdown && (
              <button
              type="button"
              onClick={() => setShowRecipientsDropdown(true)}
              className="w-full border rounded p-2 text-left bg-gray-50 hover:bg-gray-100"
            >
              {messageData.recipients.length > 0
                ? `Selected (${messageData.recipients.length}) - Click to Change`
                : 'Select Recipients'}
            </button>
            
            )}
            {showRecipientsDropdown && (
              <div className="mt-2">
                <RecipientDropdown
                  recipients={recipientsList}
                  onSelect={handleRecipientSelect}
                />
                <button
                  type="button"
                  onClick={confirmRecipients}
                  className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Confirm Recipients
                </button>
              </div>
            )}
          </div>
        )}
        <div>
          <label className="block font-medium mb-1">Links (Optional):</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={messageData.links}
            onChange={(e) => setMessageData({ ...messageData, links: e.target.value })}
            placeholder="Enter link(s), separated by commas"
          />
        </div>
        <button
          type="submit"
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default StudentMessageForm;
