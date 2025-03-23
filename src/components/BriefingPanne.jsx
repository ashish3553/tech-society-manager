// src/components/BriefingPanel.jsx
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function BriefingPanel() {
  const { auth } = useContext(AuthContext);
  // Initially, we assume there is no briefing, so we're in editing (create) mode.
  const [isEditing, setIsEditing] = useState(true);
  // briefingData holds the briefing fields.
  const [briefingData, setBriefingData] = useState({
    classSummary: '',
    classQuestions: '',
    homeworkQuestions: ''
  });
  // briefingId to know if a briefing exists.
  const [briefingId, setBriefingId] = useState(null);

  // Optional: Fetch existing briefing on component mount if needed.
  // useEffect(() => {
  //   const fetchBriefing = async () => {
  //     try {
  //       const res = await api.get('/dailyBriefing');
  //       if(res.data){
  //         setBriefingData({
  //           classSummary: res.data.classSummary,
  //           classQuestions: res.data.classQuestions,
  //           homeworkQuestions: res.data.homeworkQuestions
  //         });
  //         setBriefingId(res.data._id);
  //         setIsEditing(false);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchBriefing();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (briefingId) {
        // Update existing briefing
        const res = await api.put(`/dailyBriefing/${briefingId}`, briefingData);
        toast.success('Daily briefing updated successfully!');
      } else {
        // Create new briefing
        const res = await api.post('/dailyBriefing', briefingData);
        setBriefingId(res.data._id);
        toast.success('Daily briefing created successfully!');
      }
      // Switch to view mode
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create/update daily briefing.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/dailyBriefing/${briefingId}`);
      setBriefingData({ classSummary: '', classQuestions: '', homeworkQuestions: '' });
      setBriefingId(null);
      setIsEditing(true); // switch to edit mode for new entry
      toast.success('Daily briefing deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete daily briefing.');
    }
  };

  // Determine user role for conditional rendering of buttons
  const role = auth?.user?.role;

  return (
    <div className=" rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Daily Briefing</h2>

      {isEditing ? (
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
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
          >
            {briefingId ? 'Update Briefing' : 'Submit Briefing'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <strong>Class Summary:</strong>
            <p>{briefingData.classSummary}</p>
          </div>
          <div>
            <strong>Class Questions:</strong>
            <p>{briefingData.classQuestions}</p>
          </div>
          <div>
            <strong>Homework Questions:</strong>
            <p>{briefingData.homeworkQuestions}</p>
          </div>
        </div>
      )}

      {/* Conditionally render action buttons based on user role */}
      {/* For mentors and admins, show both Edit and Delete.
          For volunteers, show only Edit.
          For students/visitors, show nothing. */}
      {briefingId && (role === 'mentor' || role === 'admin' || role === 'volunteer') && !isEditing && (
        <div className="mt-4 flex gap-4">
          <button 
            onClick={handleEdit}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          {(role === 'mentor' || role === 'admin') && (
            <button 
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default BriefingPanel;
