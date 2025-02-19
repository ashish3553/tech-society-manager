// src/components/AssignmentDisplay.jsx
import React from 'react';

const AssignmentDisplay = ({ assignment }) => {

  console.log("Recieved asssignment is: ", assignment)


  const creater = assignment.createdBy.name || "Dummy"
  const lastModifier = assignment.lastModifiedBy.name ||"Dummy"
  const displayDate = new Date(assignment.updatedAt || assignment.createdAt).toLocaleString('en-IN');
  return (
    <div className=" rounded shadow p-6">
      <h2 className="text-3xl font-bold mb-4">{assignment.title}</h2>
      
      {/* Explanation Box */}
      <div className="mb-4">
        <h3 className="text-2xl font-semibold mb-2">Explanation</h3>
        <div 
          className="border rounded p-4 bg-gray-50 whitespace-pre-wrap text-gray-800"
          dangerouslySetInnerHTML={{ __html: assignment.explanation }}
        />
      </div>
      
      {/* Test Cases in Grid */}
      {assignment.testCases && assignment.testCases.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Test Cases</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {assignment.testCases.map((tc, idx) => (
              <div key={idx} className="border rounded p-4 bg-gray-50">
                <div className="mb-2">
                  <span className="font-bold block">Input {idx+1}</span>
                  <pre className="whitespace-pre-wrap text-gray-800 text-sm">{tc.input}</pre>
                </div>
                <div className="mb-2">
                  <span className="font-bold block">Output</span>
                  <pre className="whitespace-pre-wrap text-gray-800 text-sm">{tc.output}</pre>
                </div>
                {tc.explanation && (
                  <div className="mt-2  pt-2">
                    <span className="font-bold block">Explanation:</span>
                    <p className="whitespace-pre-wrap text-gray-700 text-sm">{tc.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
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

      {creater && (
        <div className="text-gray-600 mb-4">
          <p><strong>Uploaded By:</strong> {creater}</p>
          <p><strong>Last modified By:</strong> {lastModifier}</p>
          {/* <p><strong>Mentor Branch:</strong> {assignment.createdBy.branch || 'N/A'}</p> */}
        </div>
      )}
      <div className="text-gray-500 text-xs text-right">Last Updated: {displayDate}</div>
    </div>
  );
};

export default AssignmentDisplay;
