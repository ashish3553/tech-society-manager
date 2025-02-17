// src/pages/PreviousArchive.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import BriefingCard from '../components/BriefingCard';
import MessageCard from '../components/MessageCard';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

// Helper to get current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  return now.toISOString().slice(0, 7);
};

function PreviousArchive() {
  const { auth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('briefings'); // 'briefings' or 'announcements'
  const [briefings, setBriefings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [month, setMonth] = useState(getCurrentMonth());

  // Fetch archived briefings for the given month (if provided)
  useEffect(() => {
    const fetchBriefings = async () => {
      try {
        const params = {};
        if (month) {
          params.month = month;
        }
        const res = await api.get('/dailyBriefing/archive', { params });
        setBriefings(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch previous briefings.');
      }
    };

    if (activeTab === 'briefings') {
      fetchBriefings();
    }
  }, [month, activeTab]);

  // Fetch previous announcements (public messages sent by mentors/admins)
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/messages/public');
        // Filter for messages where the sender's role is mentor or admin.
        const filtered = res.data.filter(
          (msg) =>
            msg.sender &&
            (msg.sender.role.toLowerCase() === 'mentor' ||
              msg.sender.role.toLowerCase() === 'admin')
        );
        setAnnouncements(filtered);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch announcements.');
      }
    };

    if (activeTab === 'announcements') {
      fetchAnnouncements();
    }
  }, [activeTab]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Previous Archives</h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab('briefings')}
          className={`py-2 px-4 rounded shadow transition-colors duration-200 ${
            activeTab === 'briefings'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Previous Briefings
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`py-2 px-4 rounded shadow transition-colors duration-200 ${
            activeTab === 'announcements'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Previous Announcements
        </button>
      </div>

      {activeTab === 'briefings' && (
        <div>
          {/* Filter by month */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Month
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          {briefings.length === 0 ? (
            <p className="text-gray-500">
              No briefings available for the selected month.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {briefings.map((briefing) => (
                <BriefingCard key={briefing._id} briefing={briefing} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'announcements' && (
        <div>
          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {announcements.map((msg) => (
                <MessageCard key={msg._id} message={msg} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PreviousArchive;
