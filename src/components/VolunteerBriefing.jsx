// src/components/VolunteerBriefing.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function VolunteerBriefing() {
  const { auth } = useContext(AuthContext);
  // Local state for the briefing form
  const [briefing, setBriefing] = useState({
    classSummary: '',
    classQuestions: '',
    homeworkQuestions: ''
  });
  // State to store the briefing already created (if any)
  const [existingBriefing, setExistingBriefing] = useState(null);
  // Editing flag: if a briefing exists, we're in edit mode.
  const [editing, setEditing] = useState(false);

  // Fetch the current briefing on mount.
  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        // Assumes this route returns the briefing created in the last 24 hours
        const res = await api.get('/dailyBriefing/current');
        setExistingBriefing(res.data);
        // Preload the form with the current briefing data
        setBriefing({
          classSummary: res.data.classSummary,
          classQuestions: res.data.classQuestions,
          homeworkQuestions: res.data.homeworkQuestions
        });
        setEditing(true);
      } catch (err) {
        // If no current briefing exists, we can simply start with an empty form.
        console.log('No current briefing found, you can create one.');
      }
    };
    fetchBriefing();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing && existingBriefing) {
        // Edit the existing briefing using the PUT route.
        const res = await api.put(`/dailyBriefing/${existingBriefing._id}`, briefing);
        toast.success('Briefing updated successfully!');
        setExistingBriefing(res.data);
      } else {
        // Create a new briefing using the POST route.
        const res = await api.post('/dailyBriefing', briefing);
        toast.success('Briefing created successfully!');
        setExistingBriefing(res.data);
        setEditing(true);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit briefing.');
    }
  };

  return (
    <div className=" rounded shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Volunteer Class Briefing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class Summary:</label>
          <textarea 
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-indigo-300"
            value={briefing.classSummary}
            onChange={(e) => setBriefing({ ...briefing, classSummary: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class Questions:</label>
          <textarea 
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-indigo-300"
            value={briefing.classQuestions}
            onChange={(e) => setBriefing({ ...briefing, classQuestions: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Homework Questions:</label>
          <textarea 
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-indigo-300"
            value={briefing.homeworkQuestions}
            onChange={(e) => setBriefing({ ...briefing, homeworkQuestions: e.target.value })}
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          {editing ? 'Update Briefing' : 'Create Briefing'}
        </button>
      </form>
    </div>
  );
}

export default VolunteerBriefing;
