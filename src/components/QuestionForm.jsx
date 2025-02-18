// src/components/QuestionForm.jsx
import React, { useState, useEffect } from 'react';
import BasicTextEditor from './BasicTextEditor';
import { toast } from 'react-toastify';
import api from '../services/api';

const presetMajorTopics = [
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
];

function QuestionForm({ isEdit = false, initialData, onCancel, onSubmit: externalOnSubmit }) {
  // If editing, pre-fill state with initialData; otherwise use defaults.
  console.log("Initial data is: ", initialData)
  const [questionData, setQuestionData] = useState(
    initialData || {
      title: '', 
      explanation: '',
      // Test cases will be stored as an array of objects:
      testCases: [],
      difficulty: 'easy',
      tags: '',
      repoCategory: 'question', // question or project
      questionType: 'coding',   // if repoCategory === "question"
      majorTopic: presetMajorTopics[0],
      // Similar questions is an array of objects with title and url
      similarQuestions: [],
      codingPlatformLink: ''
    }
  );

  // State for new test case entry:
  const [newTestCase, setNewTestCase] = useState({ input: '', output: '', explanation: '' });
  // State for new similar question:
  const [newSimilar, setNewSimilar] = useState({ title: '', url: '' });

  // Handler for BasicTextEditor to save explanation:
  const handleEditorSave = (value) => {
    setQuestionData((prev) => ({ ...prev, explanation: value }));
  };

  // Handler to add a test case:
  const addTestCase = () => {
    if (newTestCase.input.trim() && newTestCase.output.trim()) {
      setQuestionData((prev) => ({
        ...prev,
        testCases: [...prev.testCases, newTestCase]
      }));
      setNewTestCase({ input: '', output: '', explanation: '' });
    } else {
      toast.error('Test case must have at least input and output.');
    }
  };

  // Handler to add a similar question:
  const addSimilarQuestion = () => {
    if (newSimilar.title.trim() && newSimilar.url.trim()) {
      setQuestionData((prev) => ({
        ...prev,
        similarQuestions: [...prev.similarQuestions, newSimilar]
      }));
      setNewSimilar({ title: '', url: '' });
    } else {
      toast.error('Please provide both title and URL for similar question.');
    }
  };

  // Internal submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare FormData payload:
    const formData = new FormData();
    formData.append('title', questionData.title);
    formData.append('explanation', questionData.explanation);
    // Append test cases and similar questions as JSON strings:
    formData.append('testCases', JSON.stringify(questionData.testCases));
    formData.append('difficulty', questionData.difficulty);
    formData.append('tags', questionData.tags);
    formData.append('repoCategory', questionData.repoCategory);
    if (questionData.repoCategory === 'question') {
      formData.append('questionType', questionData.questionType);
    }
    formData.append('majorTopic', questionData.majorTopic);
    formData.append('similarQuestions', JSON.stringify(questionData.similarQuestions));
    formData.append('codingPlatformLink', questionData.codingPlatformLink);

    // (Optional) Debug FormData entries:
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    try {
      // If external onSubmit prop is provided, use it (for edit)...
      if (externalOnSubmit) {
        await externalOnSubmit(questionData);
      } else {
        // Otherwise, create a new question:
        await api.post('/assignments', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Item created successfully!');
        // Reset state for a new question:
        setQuestionData({
          title: '',
          explanation: '',
          testCases: [],
          difficulty: 'easy',
          tags: '',
          repoCategory: 'question',
          questionType: 'coding',
          majorTopic: presetMajorTopics[0],
          similarQuestions: [],
          codingPlatformLink: ''
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create item.');
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? 'Edit Question' : `Create ${questionData.repoCategory === 'question' ? 'Question' : 'Project'}`}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title:</label>
          <input 
            type="text" 
            className="w-full border rounded p-2" 
            value={questionData.title}
            onChange={(e) => setQuestionData({ ...questionData, title: e.target.value })}
            required
          />
        </div>
        {/* Content (Explanation) */}
        <div>
          <label className="block font-medium mb-1">Content:</label>
          <BasicTextEditor onSave={handleEditorSave} initialContent={questionData.explanation} />
        </div>
        {/* Test Cases Section */}
        <div>
          <label className="block font-medium mb-1">Test Cases:</label>
          {questionData.testCases.map((tc, index) => (
            <div key={index} className="border p-2 mb-2 rounded">
              <p><strong>Input:</strong> {tc.input}</p>
              <p><strong>Output:</strong> {tc.output}</p>
              {tc.explanation && <p><strong>Explanation:</strong> {tc.explanation}</p>}
            </div>
          ))}
          <div className="border p-2 rounded mb-2">
            <input 
              type="text"
              placeholder="Test Case Input (supports multiline)"
              value={newTestCase.input}
              onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
              className="w-full border rounded p-2 mb-2"
            />
            <input 
              type="text"
              placeholder="Test Case Output"
              value={newTestCase.output}
              onChange={(e) => setNewTestCase({ ...newTestCase, output: e.target.value })}
              className="w-full border rounded p-2 mb-2"
            />
            <textarea 
              placeholder="Explanation (optional)"
              value={newTestCase.explanation}
              onChange={(e) => setNewTestCase({ ...newTestCase, explanation: e.target.value })}
              className="w-full border rounded p-2 mb-2"
            ></textarea>
            <button type="button" onClick={addTestCase} className="bg-green-500 text-white px-3 py-1 rounded">
              Add Test Case
            </button>
          </div>
        </div>
        {/* Difficulty */}
        <div>
          <label className="block font-medium mb-1">Difficulty:</label>
          <select 
            className="w-full border rounded p-2"
            value={questionData.difficulty}
            onChange={(e) => setQuestionData({ ...questionData, difficulty: e.target.value })}
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        {/* Tags */}
        <div>
          <label className="block font-medium mb-1">Tags (comma separated):</label>
          <input 
            type="text"
            className="w-full border rounded p-2"
            value={questionData.tags}
            onChange={(e) => setQuestionData({ ...questionData, tags: e.target.value })}
          />
        </div>
        {/* Repo Category */}
        <div>
          <label className="block font-medium mb-1">Category:</label>
          <select 
            className="w-full border rounded p-2"
            value={questionData.repoCategory}
            onChange={(e) => setQuestionData({ ...questionData, repoCategory: e.target.value })}
            required
          >
            <option value="question">Question</option>
            <option value="project">Project</option>
          </select>
        </div>
        {/* If Question, select Question Type */}
        {questionData.repoCategory === 'question' && (
          <div>
            <label className="block font-medium mb-1">Question Type:</label>
            <select 
              className="w-full border rounded p-2"
              value={questionData.questionType}
              onChange={(e) => setQuestionData({ ...questionData, questionType: e.target.value })}
              required
            >
              <option value="coding">Coding</option>
              <option value="conceptual">Conceptual</option>
            </select>
          </div>
        )}
        {/* Major Topic */}
        <div>
          <label className="block font-medium mb-1">Major Topic:</label>
          <select 
            className="w-full border rounded p-2"
            value={questionData.majorTopic}
            onChange={(e) => setQuestionData({ ...questionData, majorTopic: e.target.value })}
            required
          >
            {presetMajorTopics.map((topic, idx) => (
              <option key={idx} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
        {/* Similar Questions Section */}
        <div>
          <label className="block font-medium mb-1">Similar Questions:</label>
          {questionData.similarQuestions.map((sq, index) => (
            <div key={index} className="border p-2 mb-2 rounded">
              <p><strong>Title:</strong> {sq.title}</p>
              <p><strong>URL:</strong> {sq.url}</p>
            </div>
          ))}
          <div className="border p-2 rounded mb-2">
            <input 
              type="text"
              placeholder="Similar Question Title"
              value={newSimilar.title}
              onChange={(e) => setNewSimilar({ ...newSimilar, title: e.target.value })}
              className="w-full border rounded p-2 mb-2"
            />
            <input 
              type="text"
              placeholder="Similar Question URL"
              value={newSimilar.url}
              onChange={(e) => setNewSimilar({ ...newSimilar, url: e.target.value })}
              className="w-full border rounded p-2 mb-2"
            />
            <button type="button" onClick={addSimilarQuestion} className="bg-green-500 text-white px-3 py-1 rounded">
              Add Similar Question
            </button>
          </div>
        </div>
        {/* Coding Platform Link */}
        <div>
          <label className="block font-medium mb-1">Coding Platform Link (optional):</label>
          <input 
            type="text"
            className="w-full border rounded p-2"
            value={questionData.codingPlatformLink}
            onChange={(e) => setQuestionData({ ...questionData, codingPlatformLink: e.target.value })}
          />
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button 
            type="submit" 
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            {isEdit ? 'Save Changes' : (questionData.repoCategory === 'question' ? 'Create Question' : 'Create Project')}
          </button>
          {isEdit && (
            <button 
              type="button" 
              onClick={onCancel}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default QuestionForm;
