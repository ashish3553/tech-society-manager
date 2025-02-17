// src/components/StudentSolutionSection.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const StudentSolutionSection = ({ assignmentId }) => {
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        console.log("Assignment solution cll ho rha hai")
        const res = await api.get(`/assignments/${assignmentId}/solution`);
        console.log("Solution is:",res.data)
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/solutions/${solution._id}/feedback`, { feedback: feedbackText });
      toast.success('Feedback submitted successfully!');
      setFeedbackText('');
      setShowFeedbackModal(false);
      // Optionally refresh the solution to get updated feedbacks:
      const res = await api.get(`/assignments/${assignmentId}/solution`);
      setSolution(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit feedback.');
    }
  };

  if (loading) return <div>Loading solution...</div>;
  if (!solution) return <div>No solution available for this assignment.</div>;
  if (!solution.published) return <div>Solution is hidden by the admin.</div>;

  return (
    <div className="bg-white rounded shadow p-6 mt-4">
      <div className=" flex space-x-4 justify-between">
      <h3 className="text-2xl font-bold mb-4">Solution (Read-Only)</h3>

        <button
          onClick={() => setShowFeedbackModal(true)}
          className="bg-green-600 text-white px-4  mb-2 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Give Feedback
        </button>
      </div>
      <div 
        className="solution-content mb-4" 
        dangerouslySetInnerHTML={{ __html: solution.content }}
      />
     
         {/* Dont need to show feedback to the students */}

      {/* {solution.feedbacks && solution.feedbacks.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-bold mb-2">Feedbacks</h4>
          <ul className="space-y-2">
            {solution.feedbacks.map((fb) => (
              <li key={fb._id} className="border rounded p-2">
                <p>{fb.feedback}</p>
                <small className="text-gray-500">
                  {new Date(fb.createdAt).toLocaleString('en-IN')}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )} */}
      {showFeedbackModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Provide Feedback</h2>
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
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSolutionSection;
