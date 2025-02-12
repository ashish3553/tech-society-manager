// src/pages/PublicHome.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function PublicHome() {
  const [briefing, setBriefing] = useState(null);

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        const res = await api.get('/dailyBriefing'); // This route is now public.
        setBriefing(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBriefing();
  }, []);

  if (!briefing) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-500">No briefing available for today.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-3xl font-bold mb-4">Today's Class Briefing</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Class Summary</h3>
          <p>{briefing.classSummary}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Class Questions</h3>
          <ul className="list-disc list-inside">
            {briefing.classQuestions.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Homework Questions</h3>
          <ul className="list-disc list-inside">
            {briefing.homeworkQuestions.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PublicHome;
