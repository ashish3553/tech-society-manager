// src/pages/PreviousBriefings.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

function PreviousBriefings() {
  const [briefings, setBriefings] = useState([]);
  const [month, setMonth] = useState('');

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

  useEffect(() => {
    fetchBriefings();
  }, [month]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Previous Class Briefings</h1>
      <div className="bg-white p-6 rounded shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      {briefings.length === 0 ? (
        <p className="text-gray-500">No briefings available for the selected month.</p>
      ) : (
        <div className="space-y-4">
          {briefings.map((briefing) => (
            <div key={briefing._id} className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-2">{briefing.classSummary}</h2>
              <p><strong>Class Questions:</strong> {briefing.classQuestions}</p>
              <p><strong>Homework Questions:</strong> {briefing.homeworkQuestions}</p>
              <p className="text-gray-500 text-xs mt-2">Created At: {new Date(briefing.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PreviousBriefings;
