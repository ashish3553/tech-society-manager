// src/components/AssignmentDisplay.jsx
import React from 'react';

const AssignmentDisplay = ({ assignment }) => {
  const displayDate = new Date(assignment.updatedAt || assignment.createdAt).toLocaleString('en-IN');
  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-3xl font-bold mb-4">{assignment.title}</h2>
      <div className="mb-4">
        <h3 className="text-2xl font-semibold mb-2">Explanation</h3>
        <div className="prose" dangerouslySetInnerHTML={{ __html: assignment.explanation }} />
      </div>
      {assignment.testCases && assignment.testCases.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Test Cases</h3>
          <ul className="list-disc list-inside">
            {assignment.testCases.map((tc, idx) => (
              <li  className=' list-none' key={idx}>
                <p><strong>Input:</strong> {tc.input}</p>
                <p><strong>Output:</strong> {tc.output}</p>
                {tc.explanation && <p><strong>Explanation:</strong> {tc.explanation}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {assignment.files && assignment.files.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Attachments</h3>
          <div className="flex flex-wrap gap-4">
            {assignment.files.map((fileUrl, idx) => (
              <a key={idx} href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View File {idx + 1}
              </a>
            ))}
          </div>
        </div>
      )}
      {assignment.codingPlatformLink && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Coding Platform</h3>
          <a href={assignment.codingPlatformLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Visit Coding Platform
          </a>
        </div>
      )}
      {assignment.similarQuestions && assignment.similarQuestions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Similar Questions</h3>
          <ul className="list-disc list-inside">
            {assignment.similarQuestions.map((sq, idx) => (
              <li key={idx}>
                <a href={sq.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {sq.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {assignment.createdBy && (
        <div className="text-gray-600 mb-4">
          <p><strong>Uploaded By:</strong> {assignment.createdBy.name}</p>
          <p><strong>Mentor Branch:</strong> {assignment.createdBy.branch || 'N/A'}</p>
        </div>
      )}
      <div className="text-gray-500 text-xs text-right">Last Updated: {displayDate}</div>
    </div>
  );
};

export default AssignmentDisplay;
