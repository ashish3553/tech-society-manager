// src/components/AssignmentEditForm.jsx
import React from 'react';

const AssignmentEditForm = ({ editData, setEditData, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-dark">
      <div>
        <label className="block font-medium mb-1">Title:</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Explanation (HTML allowed):</label>
        <textarea
          className="w-full border rounded p-2"
          value={editData.explanation}
          onChange={(e) => setEditData({ ...editData, explanation: e.target.value })}
          rows="5"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Test Cases (JSON array):</label>
        <textarea
          className="w-full border rounded p-2 font-mono text-sm"
          value={editData.testCases}
          onChange={(e) => setEditData({ ...editData, testCases: e.target.value })}
          rows="5"
          placeholder='e.g. [{"input": "1,2,3", "output": "3,2,1", "explanation": "Reverse order"}]'
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Tags (comma separated):</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={editData.tags}
          onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Repository Category:</label>
        <select
          className="w-full border rounded p-2"
          value={editData.repoCategory}
          onChange={(e) => setEditData({ ...editData, repoCategory: e.target.value })}
          required
        >
          <option value="question">Question</option>
          <option value="project">Project</option>
        </select>
      </div>
      {editData.repoCategory === 'question' && (
        <div>
          <label className="block font-medium mb-1">Question Type:</label>
          <select
            className="w-full border rounded p-2"
            value={editData.questionType}
            onChange={(e) => setEditData({ ...editData, questionType: e.target.value })}
            required
          >
            <option value="coding">Coding</option>
            <option value="conceptual">Conceptual</option>
          </select>
        </div>
      )}
      <div>
        <label className="block font-medium mb-1">Major Topic:</label>
        <select
          className="w-full border rounded p-2"
          value={editData.majorTopic}
          onChange={(e) => setEditData({ ...editData, majorTopic: e.target.value })}
          required
        >
          {[
            "Basics & Syntax",
            "Data Types & Variables",
            "Operators",
            "Control Structures",
            "Functions",
            "Pointers & Memory Management",
            "Arrays",
            "String",
            "Object-Oriented Programming (OOP)",
            "Templates & Generic Programming",
            "STL",
            "Exception Handling",
            "File I/O",
            "Advanced Topics"
          ].map((topic, idx) => (
            <option key={idx} value={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Similar Questions (JSON array):</label>
        <textarea
          className="w-full border rounded p-2 font-mono text-sm"
          value={editData.similarQuestions}
          onChange={(e) => setEditData({ ...editData, similarQuestions: e.target.value })}
          rows="5"
          placeholder='e.g. [{"title": "Example Q", "url": "https://example.com/q"}]'
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Coding Platform Link (optional):</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={editData.codingPlatformLink}
          onChange={(e) => setEditData({ ...editData, codingPlatformLink: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-4">
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
          Save Changes
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AssignmentEditForm;
