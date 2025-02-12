// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MessageCard from '../components/MessageCard';
import { toast } from 'react-toastify';

function Home() {
  const [briefings, setBriefings] = useState([]);
  const [messages, setMessages] = useState([]);

  // Fetch two recent class briefings
  useEffect(() => {
    const fetchRecentBriefings = async () => {
      try {
        const res = await api.get('/dailyBriefing/recent');
        console.log("Fetched recent briefings:", res.data); // Debug log
        setBriefings(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch recent briefings.');
      }
    };
    fetchRecentBriefings();
  }, []);

  // Fetch three recent mentor messages
  useEffect(() => {
    const fetchRecentMentorMessages = async () => {
      try {
        const res = await api.get('/messages/recent-mentor');
        console.log("Fetched recent mentor messages:", res.data); // Debug log
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch recent mentor messages.');
      }
    };
    fetchRecentMentorMessages();
  }, []);

  // Helper function: determine display date (use updatedAt if more recent than createdAt)
  const getDisplayDate = (item) => {
    if (!item) return '';
    const createdDate = new Date(item.createdAt);
    const updatedDate = item.updatedAt ? new Date(item.updatedAt) : null;
    const displayDate = updatedDate && updatedDate > createdDate ? updatedDate : createdDate;
    return displayDate.toLocaleString('en-IN');
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Coding Journey</h1>

      {/* Recent Class Briefings Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Class Briefings</h2>
        {briefings.length === 0 ? (
          <p className="text-gray-500">No briefings available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {briefings.map((briefing) => (
              <div key={briefing._id} className="bg-white p-6 rounded shadow relative">
                <h3 className="text-xl font-bold mb-2">Class Briefing</h3>
                <div className="mb-2">
                  <p className="font-semibold text-gray-700">Summary:</p>
                  <p className="whitespace-pre-line text-gray-800">{briefing.classSummary}</p>
                </div>
                <div className="mb-2">
                  <p className="font-semibold text-gray-700">Class Questions:</p>
                  <p className="whitespace-pre-line text-gray-800">{briefing.classQuestions}</p>
                </div>
                <div className="mb-2">
                  <p className="font-semibold text-gray-700">Homework Questions:</p>
                  <p className="whitespace-pre-line text-gray-800">{briefing.homeworkQuestions}</p>
                </div>
                <div className="absolute bottom-4 right-4 text-sm text-gray-600 text-right">
                  Posted by: {briefing.createdBy?.name} ({briefing.createdBy?.role})<br />
                  Date: {getDisplayDate(briefing)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Mentor Messages Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Mentor Messages</h2>
        {messages.length === 0 ? (
          <p className="text-gray-500">No mentor messages available.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageCard key={msg._id} message={msg} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
