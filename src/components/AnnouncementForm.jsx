import React, { useState, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

function AnnouncementForm({ onSuccess }) {
  const { auth } = useContext(AuthContext);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [links, setLinks] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare links as an array if needed
      const linksArray = links ? links.split(',').map(link => link.trim()) : [];
      const res = await api.post('/messages/announcement', { subject, body, links: linksArray });
      toast.success('Announcement created successfully!');
      setSubject('');
      setBody('');
      setLinks('');
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create announcement.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Create Announcement</h2>
      <div className="mb-4">
        <label className="block mb-1">Subject</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Message</label>
        <textarea
          className="w-full border p-2 rounded"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Links (comma separated)</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={links}
          onChange={(e) => setLinks(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
        Save Announcement
      </button>
    </form>
  );
}

export default AnnouncementForm;
