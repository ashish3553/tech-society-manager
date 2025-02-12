// src/components/DailyBriefing.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function DailyBriefing() {
  const [briefing, setBriefing] = useState(null);

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        const res = await api.get('/dailyBriefing');
        setBriefing(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBriefing();
  }, []);

  if (!briefing)
    return (
      <p className="text-center text-gray-500">
        No briefing available for today.
      </p>
    );

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-2xl font-bold mb-4">Today's Class Briefing</h2>
      <div>
        <h3 className="text-xl font-semibold mb-2">Class Summary</h3>
        <p>{briefing.classSummary}</p>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Class Questions</h3>
        <ul className="list-disc list-inside">
          {briefing.classQuestions.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Homework Questions</h3>
        <ul className="list-disc list-inside">
          {briefing.homeworkQuestions.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DailyBriefing;
