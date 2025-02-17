// src/components/SolutionCard.jsx
import React from "react";

const SolutionCard = ({ solution, onEdit }) => {
  return (
    <div className="bg-white border rounded-lg shadow p-6 my-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Solution</h2>
        {onEdit && (
          <button
            onClick={onEdit}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
          >
            {solution ? "Edit Solution" : "Add Solution"}
          </button>
        )}
      </div>
      {solution ? (
        <div className="prose" dangerouslySetInnerHTML={{ __html: solution }} />
      ) : (
        <p className="text-gray-500 italic">No solution available yet.</p>
      )}
    </div>
  );
};

export default SolutionCard;
