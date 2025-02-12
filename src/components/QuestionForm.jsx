// src/components/QuestionForm.jsx
import React, { useState, useEffect } from 'react';
import BasicTextEditor from './BasicTextEditor';
import { toast } from 'react-toastify';
import api from '../services/api';

function QuestionForm() {
  const [questionData, setQuestionData] = useState({
    title: '',
    explanation: '',
    testCases: '',
    difficulty: 'easy',
    tags: '',
    assignmentTag: 'practice',
    codingPlatformLink: '',
    solution: '',
    attachments: null,
    assignmentType: 'public',
    selectedStudents: []
  });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/users/students');
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentSelect = (studentId, isChecked) => {
    setQuestionData((prev) => {
      const updated = isChecked
        ? [...prev.selectedStudents, studentId]
        : prev.selectedStudents.filter((id) => id !== studentId);
      return { ...prev, selectedStudents: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', questionData.title);
    formData.append('explanation', questionData.explanation);
    formData.append('testCases', questionData.testCases);
    formData.append('difficulty', questionData.difficulty);
    formData.append('tags', questionData.tags);
    formData.append('assignmentTag', questionData.assignmentTag);
    formData.append('codingPlatformLink', questionData.codingPlatformLink);
    formData.append('solution', questionData.solution);
    formData.append('category', questionData.assignmentType === 'public' ? 'public' : 'personal');
    if (questionData.assignmentType === 'personal') {
      formData.append('assignedTo', JSON.stringify(questionData.selectedStudents));
    }
    if (questionData.attachments) {
      for (let i = 0; i < questionData.attachments.length; i++) {
        formData.append('attachments', questionData.attachments[i]);
      }
    }
    try {
      await api.post('/assignments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Question created successfully!');
      setQuestionData({
        title: '',
        explanation: '',
        testCases: '',
        difficulty: 'easy',
        tags: '',
        assignmentTag: 'practice',
        codingPlatformLink: '',
        solution: '',
        attachments: null,
        assignmentType: 'public',
        selectedStudents: []
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to create question.');
    }
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Create Question</h2>
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
        {/* Question Content */}
        <div>
          <label className="block font-medium mb-1">Question Content:</label>
          <BasicTextEditor onSave={(value) => setQuestionData({ ...questionData, explanation: value })} />
        </div>
        {/* Test Cases */}
        <div>
          <label className="block font-medium mb-1">Test Cases:</label>
          <textarea 
            className="w-full border rounded p-2" 
            value={questionData.testCases}
            onChange={(e) => setQuestionData({ ...questionData, testCases: e.target.value })}
          />
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
        {/* Assignment Tag */}
        <div>
          <label className="block font-medium mb-1">Assignment Tag:</label>
          <select 
            className="w-full border rounded p-2"
            value={questionData.assignmentTag}
            onChange={(e) => setQuestionData({ ...questionData, assignmentTag: e.target.value })}
            required
          >
            <option value="practice">Practice</option>
            <option value="HW">HW</option>
            <option value="CW">CW</option>
          </select>
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
        {/* Solution */}
        <div>
          <label className="block font-medium mb-1">Solution (optional):</label>
          <textarea 
            className="w-full border rounded p-2"
            value={questionData.solution}
            onChange={(e) => setQuestionData({ ...questionData, solution: e.target.value })}
          />
        </div>
        {/* Attachments */}
        <div>
          <label className="block font-medium mb-1">Attachments (Images/PDFs):</label>
          <input 
            type="file" 
            multiple
            onChange={(e) => setQuestionData({ ...questionData, attachments: e.target.files })}
            className="w-full"
            accept="image/*,application/pdf"
          />
        </div>
        {/* Assignment Type */}
        <div>
          <label className="block font-medium mb-1">Assignment Type:</label>
          <select 
            className="w-full border rounded p-2"
            value={questionData.assignmentType}
            onChange={(e) => setQuestionData({ ...questionData, assignmentType: e.target.value })}
            required
          >
            <option value="public">Public Assignment</option>
            <option value="personal">Personal Assignment</option>
          </select>
        </div>
        {/* For Personal Assignment: Student Selection */}
        {questionData.assignmentType === 'personal' && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Select Students for Personal Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map((student) => (
                <div key={student._id} className="border rounded p-2 flex items-center">
                  <input 
                    type="checkbox" 
                    onChange={(e) => handleStudentSelect(student._id, e.target.checked)}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    {student.profileImage ? (
                      <img
                        src={student.profileImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full mr-2 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Img</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      <p className="text-sm text-gray-600">{student.branch}, {student.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          Create Question
        </button>
      </form>
    </div>
  );
}

export default QuestionForm;
