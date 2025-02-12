// src/components/StudentListSection.jsx
import React from 'react';
import StudentCard from './StudentCard';

function StudentListSection({ students, onUpdate, onDelete }) {
  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Student List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length === 0 ? (
          <p className="text-gray-500">No students available.</p>
        ) : (
          students.map((student) => (
            <StudentCard 
              key={student._id} 
              student={student}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default StudentListSection;
