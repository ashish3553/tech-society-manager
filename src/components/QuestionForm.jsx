// src/components/QuestionForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import BasicTextEditor from './BasicTextEditor';
import { toast } from 'react-toastify';
// import SyncfusionEditor from './SyncfusionEditor';
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
  // Helper to parse JSON fields if necessary.
  const parseData = (data) => ({
    ...data,
    testCases: typeof data.testCases === 'string'
      ? JSON.parse(data.testCases)
      : data.testCases || [],
    similarQuestions: typeof data.similarQuestions === 'string'
      ? JSON.parse(data.similarQuestions).map(item => ({
          title: item.title,
          url: item.url
        }))
      : Array.isArray(data.similarQuestions)
        ? data.similarQuestions.map(item => ({
            title: item.title,
            url: item.url
          }))
        : [],
  });

  const [questionData, setQuestionData] = useState(
    initialData ? parseData(initialData) : {
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
    }
  );

  useEffect(() => {
    if (initialData) {
      setQuestionData(parseData(initialData));
    }
  }, [initialData]);

  // State for new test case entry:
  const [newTestCase, setNewTestCase] = useState({ input: '', output: '', explanation: '' });
  // State for new similar question:
  const [newSimilar, setNewSimilar] = useState({ title: '', url: '' });

  // Ref for the BasicTextEditor
  const editorRef = useRef(null);

  // Handler for BasicTextEditor to update explanation.
  const handleEditorSave = (value) => {
    setQuestionData((prev) => ({ ...prev, explanation: value }));
  };

  // --- Test Cases Handlers ---
  const updateTestCase = (index, field, value) => {
    const updatedTestCases = [...questionData.testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    setQuestionData((prev) => ({ ...prev, testCases: updatedTestCases }));
  };

  const removeTestCase = (index) => {
    const updatedTestCases = questionData.testCases.filter((_, i) => i !== index);
    setQuestionData((prev) => ({ ...prev, testCases: updatedTestCases }));
  };

  // --- Similar Questions Handlers ---
  const updateSimilarQuestion = (index, field, value) => {
    const updatedSimilar = [...questionData.similarQuestions];
    updatedSimilar[index] = { ...updatedSimilar[index], [field]: value };
    setQuestionData((prev) => ({ ...prev, similarQuestions: updatedSimilar }));
  };

  const removeSimilarQuestion = (index) => {
    const updatedSimilar = questionData.similarQuestions.filter((_, i) => i !== index);
    setQuestionData((prev) => ({ ...prev, similarQuestions: updatedSimilar }));
  };

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

  // Final submit handler: Trigger editor save first.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Trigger the editor's save method to update explanation in state.
    if (editorRef.current) {
      editorRef.current.triggerSave();
    }
    // Prepare FormData payload.
    const formData = new FormData();
    formData.append('title', questionData.title);
    formData.append('explanation', questionData.explanation);
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

    try {
      if (externalOnSubmit) {
        await externalOnSubmit(questionData);
      } else {
        await api.post('/assignments', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Item created successfully!');
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
    <div className=" rounded shadow p-6">
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
          <BasicTextEditor 
            ref={editorRef}
            onSave={handleEditorSave} 
            initialContent={questionData.explanation} 
          />
        </div>
        {/* Test Cases Section */}
        <div>
          <label className="block font-medium mb-1">Test Cases:</label>
          <div className="space-y-4">
            {(Array.isArray(questionData.testCases) ? questionData.testCases : []).map((tc, index) => (
              <div key={index} className="border rounded p-4 bg-gray-50 flex justify-between items-start">
                <div className="flex-1">
                  <div>
                    <span className="font-bold block">Input:</span>
                    {isEdit ? (
                      <textarea
                        value={tc.input}
                        onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                        className="whitespace-pre-wrap text-sm border rounded p-1 w-full"
                        rows={3}
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">{tc.input}</pre>
                    )}
                  </div>
                  <div>
                    <span className="font-bold block">Output:</span>
                    {isEdit ? (
                      <textarea
                        value={tc.output}
                        onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                        className="whitespace-pre-wrap text-sm border rounded p-1 w-full"
                        rows={3}
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">{tc.output}</pre>
                    )}
                  </div>
                  <div className="mt-2 border-t pt-2">
                    <span className="font-bold block">Explanation:</span>
                    {isEdit ? (
                      <textarea
                        value={tc.explanation}
                        onChange={(e) => updateTestCase(index, 'explanation', e.target.value)}
                        className="whitespace-pre-wrap text-sm border rounded p-1 w-full"
                        rows={2}
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">{tc.explanation}</pre>
                    )}
                  </div>
                </div>
                {isEdit && (
                  <button 
                    type="button" 
                    onClick={() => removeTestCase(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="border p-2 rounded mb-2">
            <textarea
              placeholder="Test Case Input (supports multiline)"
              value={newTestCase.input}
              onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
              className="w-full border rounded p-2 mb-2"
              rows={3}
            ></textarea>
            <textarea
              placeholder="Test Case Output (supports multiline)"
              value={newTestCase.output}
              onChange={(e) => setNewTestCase({ ...newTestCase, output: e.target.value })}
              className="w-full border rounded p-2 mb-2"
              rows={3}
            ></textarea>
            <textarea 
              placeholder="Explanation (optional)"
              value={newTestCase.explanation}
              onChange={(e) => setNewTestCase({ ...newTestCase, explanation: e.target.value })}
              className="w-full border rounded p-2 mb-2"
              rows={2}
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
          <div className="space-y-4">
            {(Array.isArray(questionData.similarQuestions) ? questionData.similarQuestions : []).map((sq, index) => (
              <div key={index} className="border rounded p-4 bg-gray-50 flex justify-between items-start">
                <div className="flex-1">
                  <div>
                    <span className="font-bold block">Title:</span>
                    {isEdit ? (
                      <input 
                        type="text"
                        value={sq.title}
                        onChange={(e) => updateSimilarQuestion(index, 'title', e.target.value)}
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">{sq.title}</pre>
                    )}
                  </div>
                  <div>
                    <span className="font-bold block mt-1">URL:</span>
                    {isEdit ? (
                      <input 
                        type="text"
                        value={sq.url}
                        onChange={(e) => updateSimilarQuestion(index, 'url', e.target.value)}
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">{sq.url}</pre>
                    )}
                  </div>
                </div>
                {isEdit && (
                  <button 
                    type="button" 
                    onClick={() => removeSimilarQuestion(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
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
