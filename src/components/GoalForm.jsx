// src/components/WeeklyGoalForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GoalForm = ({ onClose }) => {
  const { auth } = useContext(AuthContext);
  const [goalId, setGoalId] = useState(null);
  const [bulletPoints, setBulletPoints] = useState([]);
  const [newBullet, setNewBullet] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch existing goal on mount
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await api.get(`/goals/user/${auth.user.id}`);
        if (res.data && res.data.length > 0) {
          // Assume the first goal is the active one
          const existingGoal = res.data[0];
          setGoalId(existingGoal._id);
          // Parse stored bullet points from JSON
          if (existingGoal.weeklyTarget) {
            const parsed = JSON.parse(existingGoal.weeklyTarget);
            setBulletPoints(parsed);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load your weekly goal');
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [auth.user.id]);

  // Add a new bullet point
  const addBulletPoint = () => {
    if (newBullet.trim() !== '') {
      setBulletPoints([
        ...bulletPoints,
        { text: newBullet, completed: false, justification: '' },
      ]);
      setNewBullet('');
    }
  };

  // Remove a bullet point from the list
  const removeBulletPoint = (index) => {
    setBulletPoints(bulletPoints.filter((_, i) => i !== index));
  };

  // Toggle completion status for a bullet point
  const toggleBulletCompletion = (index) => {
    setBulletPoints(
      bulletPoints.map((bp, i) =>
        i === index ? { ...bp, completed: !bp.completed } : bp
      )
    );
  };

  // Update justification for a bullet point
  const updateJustification = (index, value) => {
    setBulletPoints(
      bulletPoints.map((bp, i) =>
        i === index ? { ...bp, justification: value } : bp
      )
    );
  };

  // Save or update the weekly goal
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user: auth.user.id,
        // Save bulletPoints as JSON string
        weeklyTarget: JSON.stringify(bulletPoints),
      };
      if (goalId) {
        // Update existing goal using PUT
        console.log("Here is the goal payload: updated", payload)

        const res = await api.put(`/goals/${goalId}`, payload);
        toast.success('Weekly goal updated successfully!');
        // Update local state with response data (if needed)
        // Optionally, update bulletPoints from res.data
      } else {
        // Create new goal using POST
        console.log("Here is the goal payload posted:", payload)
        const res = await api.post('/goals', payload);
        setGoalId(res.data._id);
        toast.success('Weekly goal created successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error saving weekly goal');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Scrollable Modal Container */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {goalId ? 'Update Your Weekly Goal' : 'Set Your Weekly Goal'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Enter your goal details as bullet points:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                placeholder="Enter goal detail"
                className="flex-1 border rounded p-2"
              />
              <button
                type="button"
                onClick={addBulletPoint}
                className="bg-blue-500 text-white px-3 py-2 rounded"
              >
                Add
              </button>
            </div>
            {bulletPoints.length > 0 && (
              <ul className="mt-4 space-y-4">
                {bulletPoints.map((bp, index) => (
                  <li
                    key={index}
                    className="border rounded p-2 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={bp.completed}
                          onChange={() => toggleBulletCompletion(index)}
                          className="mr-2"
                        />
                        <span
                          className={
                            bp.completed ? 'line-through text-gray-500' : ''
                          }
                        >
                          {bp.text}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBulletPoint(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    {/* If not completed, show justification input */}
                    {!bp.completed && (
                      <div>
                        <label className="block text-gray-600 text-sm mb-1">
                          Why was this not completed?
                        </label>
                        <input
                          type="text"
                          value={bp.justification}
                          onChange={(e) =>
                            updateJustification(index, e.target.value)
                          }
                          placeholder="Enter justification (optional)"
                          className="w-full border rounded p-2 text-sm"
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Progress
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
