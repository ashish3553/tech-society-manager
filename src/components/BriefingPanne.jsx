// src/components/BriefingPanel.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

function BriefingPanel() {
  const [briefingData, setBriefingData] = useState({
    classSummary: '',
    classQuestions: '',
    homeworkQuestions: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dailyBriefing', briefingData);
      toast.success('Daily briefing created successfully!');
      setBriefingData({ classSummary: '', classQuestions: '', homeworkQuestions: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to create daily briefing.');
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Create/Update Briefing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Class Summary:</label>
          <textarea 
            className="w-full border rounded p-2" 
            value={briefingData.classSummary}
            onChange={(e) => setBriefingData({ ...briefingData, classSummary: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Class Questions:</label>
          <textarea 
            className="w-full border rounded p-2" 
            value={briefingData.classQuestions}
            onChange={(e) => setBriefingData({ ...briefingData, classQuestions: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Homework Questions:</label>
          <textarea 
            className="w-full border rounded p-2" 
            value={briefingData.homeworkQuestions}
            onChange={(e) => setBriefingData({ ...briefingData, homeworkQuestions: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
          Submit Briefing
        </button>
      </form>
    </div>
  );
}

export default BriefingPanel;
