// src/components/StudentResponseForm.jsx
import React, { useState, useEffect } from 'react';
import AdvancedTextEditor from './AdvancedTextEditor';
import "easymde/dist/easymde.min.css";

const StudentResponseForm = ({
  assignmentId,
  responseData,
  setResponseData,
  onSubmit,
  solution_content, // Object with properties "content" and "published"
  showSolution,
  setShowSolution
}) => {
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [studentSolution, setStudentSolution] = useState("");
  const [showEditorModal, setShowEditorModal] = useState(false);

  console.log("Responsen data from backend is:", responseData)

  useEffect(() => {
    document.body.style.overflow = showEditorModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showEditorModal]);

  const handleSolutionToggle = () => {
    if (showSolution) {
      setShowSolution(false);
      return;
    }
    if (!solution_content || !solution_content.content) {
      alert("Solution not added yet.");
      return;
    }
    if (solution_content.published === false) {
      alert("Solution is hidden by admin.");
      return;
    }
    setShowSolutionModal(true);
  };

  const confirmViewSolution = () => {
    setShowSolution(true);
    setShowSolutionModal(false);
  };

  const cancelSolutionModal = () => {
    setShowSolutionModal(false);
  };

  const openEditorModal = () => {
    setShowEditorModal(true);
  };

  // When saving from the editor modal, update studentSolution state and close the modal.
  const saveEditorModal = (content) => {
    setStudentSolution(content);
    setShowEditorModal(false);
  };

  const cancelEditorModal = () => {
    setShowEditorModal(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedResponse = {
      ...responseData,
      studentSolution,
    };
    onSubmit(updatedResponse);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Response fields (status, submission URL, learning notes, etc.) */}
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
            <label className="block font-medium mb-1">Submission URL (Optional):</label>
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

        <div>
          <button 
            type="button"
            onClick={openEditorModal}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
          >
            {studentSolution ? "See your solution" : "Submit your solution Code"}
          </button>
        </div>

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

      {showEditorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className=" bg-gray-400 rounded p-4 w-11/12 md:w-4/5 h-4/5 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Submit Your Code</h2>
              <button 
                onClick={cancelEditorModal} 
                className="text-red-500 font-bold text-2xl"
              >
                &times;
              </button>
            </div>
            <AdvancedTextEditor 
              onSave={saveEditorModal}
              onChange={setStudentSolution}
              initialContent={responseData.studentSolution}
            />
            <div className="flex justify-end mt-4 gap-4">
              <button 
                onClick={cancelEditorModal}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => saveEditorModal(studentSolution)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Save Content
              </button>
            </div>
          </div>
        </div>
      )}

      {showSolutionModal && (
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
                onClick={cancelSolutionModal}
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
