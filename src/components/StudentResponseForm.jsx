// src/components/StudentResponseForm.jsx
import React, { useState } from 'react';

const StudentResponseForm = ({
  assignmentId,
  responseData,
  setResponseData,
  onSubmit,
  solution_content, // Object with properties "content" and "published"
  showSolution,     // Parent's state for inline solution visibility
  setShowSolution   // Parent's setter to update that state
}) => {
  // Local state to control display of our custom confirmation modal
  const [showModal, setShowModal] = useState(false);

  // Handler for the view/hide solution button
  const handleSolutionToggle = () => {
    if (showSolution) {
      // If solution is currently visible, hide it.
      setShowSolution(false);
      return;
    }
    // Check for solution availability:
    if (!solution_content || !solution_content.content) {
      alert("Solution not added yet.");
      return;
    }
    if (solution_content.published === false) {
      alert("Solution is hidden by admin.");
      return;
    }
    // Open the custom confirmation modal before showing the solution.
    setShowModal(true);
  };

  // When the student confirms they want to view the solution.
  const confirmViewSolution = () => {
    setShowSolution(true);
    setShowModal(false);
  };

  // When the student cancels the modal.
  const cancelModal = () => {
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Response Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Update Your Status:</label>
          <select 
            value={responseData.responseStatus}
            onChange={(e) => setResponseData({ ...responseData, responseStatus: e.target.value })}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select status</option>
            <option value="solved">Solved</option>
            <option value="partially solved">Partially Solved</option>
            <option value="not understanding">Not Understanding</option>
            <option value="having doubt">Having Doubt</option>
          </select>
        </div>
        {responseData.responseStatus === 'solved' && (
          <div>
            <label className="block font-medium mb-1">Submission URL (Proof):</label>
            <input 
              type="text"
              value={responseData.submissionUrl}
              onChange={(e) => setResponseData({ ...responseData, submissionUrl: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
        )}
        {responseData.responseStatus && responseData.responseStatus !== 'solved' && (
          <div>
            <label className="block font-medium mb-1">Describe Your Problem:</label>
            <textarea 
              value={responseData.learningNotes}
              onChange={(e) => setResponseData({ ...responseData, learningNotes: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
        )}
        {responseData.responseStatus === 'solved' && (
          <div>
            <label className="block font-medium mb-1">Optional Learning Notes:</label>
            <textarea 
              value={responseData.learningNotes}
              onChange={(e) => setResponseData({ ...responseData, learningNotes: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
        )}
        <div className="flex flex-col gap-4 mt-4">
          <button 
            type="submit" 
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Update Response
          </button>
          <button 
            type="button" 
            onClick={handleSolutionToggle}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
          >
            {showSolution ? "Hide Solution" : "View Solution"}
          </button>
        </div>
      </form>

      {/* Custom Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              Do you really want to give up?
            </h2>
            <p className="mb-4">
              By viewing the solution, you indicate that you are giving up on solving this assignment.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmViewSolution}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Yes, Show Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResponseForm;
