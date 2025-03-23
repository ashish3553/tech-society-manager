// src/components/MentorActions.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentAutocomplete from './StudentAutocomplete';

const MentorActions = ({ displayDate, setIsEditingAssignment, showPersonalInput, setShowPersonalInput, selectedStudents, setSelectedStudents, handleAssignPersonal }) => {
  const navigate = useNavigate();

  return (
    <div className="border-4 bg-slate-400 border-black rounded shadow p-6">
      {/* First Row: Edit and Assign Personally */}
      <div className="flex justify-between items-center mb-2">
        <button 
          type="button" 
          onClick={() => setIsEditingAssignment(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
        >
          Edit Question
        </button>
        <button 
          type="button" 
          onClick={() => setShowPersonalInput(!showPersonalInput)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Assign Personally
        </button>
      </div>
      {/* Personal Assignment Input */}
      {showPersonalInput && (
        <div className="mb-2">
          <StudentAutocomplete onSelect={(student) => {
            if (!selectedStudents.find(s => s._id === student._id)) {
              setSelectedStudents([...selectedStudents, student]);
            }
          }} />
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedStudents.map((student) => (
              <div key={student._id} className="border p-2 rounded flex items-center">
                <span className="mr-2">{student.name} ({student.email})</span>
                <button type="button" onClick={() => {
                  setSelectedStudents(selectedStudents.filter(s => s._id !== student._id));
                }} className="text-red-500">
                  X
                </button>
              </div>
            ))}
          </div>
          <button 
            type="button"
            onClick={handleAssignPersonal}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Save Personal Assignment
          </button>
        </div>
      )}
      {/*  Already exist above therefore no need =======>>Second Row: Action Buttons with Date
      <div className="flex items-center justify-between border-t pt-3">
        <button 
          type="button" 
          onClick={() => setIsEditingAssignment(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
        >
          Edit Question
        </button>
        <span className="text-gray-500 text-xs">{displayDate}</span>
        <button 
          type="button"
          onClick={() => navigate(`/assignments/${displayDate}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div> */}
    </div>
  );
};

export default MentorActions;
