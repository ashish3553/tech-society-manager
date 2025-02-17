// src/pages/SolutionDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const SolutionDetailPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const res = await api.get(`/assignments/${assignmentId}/solution`);
        console.log("Received solution:", res.data);
        setSolution(res.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load solution.');
      } finally {
        setLoading(false);
      }
    };
    fetchSolution();
  }, [assignmentId]);

  // Handler for submitting feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/solutions/${solution._id}/feedback`, { feedback: feedbackText });
      toast.success('Feedback submitted successfully!');
      setFeedbackText('');
      setShowFeedbackModal(false);
      // Optionally, refresh the solution to get updated feedback list:
      const res = await api.get(`/assignments/${assignmentId}/solution`);
      setSolution(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit feedback.');
    }
  };

  if (loading) return <div>Loading solution...</div>;
  if (!solution) return <div>No solution available for this assignment.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{solution.title}</h1>
      {/* Display the solution content */}
      <div
        id="solution-preview"
        className="prose mb-6"
        dangerouslySetInnerHTML={{ __html: solution.content }}
      />

      {/* Button to open feedback modal */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors mb-6"
      >
        Give Feedback
      </button>

      {/* List of feedbacks (if any) */}
      {solution.feedbacks && solution.feedbacks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Feedbacks</h2>
          <ul className="space-y-2">
            {solution.feedbacks.map((fb) => (
              <li key={fb._id} className="border rounded p-2">
                <p className="text-sm">{fb.feedback}</p>
                <p className="text-xs text-gray-500">
                  {new Date(fb.createdAt).toLocaleString('en-IN')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to view the solution?</h2>
            <p className="mb-4">This will mark that you are giving up on solving it, and you can then provide feedback.</p>
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Enter your feedback..."
                className="w-full border rounded p-2 mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Yes, Show Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionDetailPage;
