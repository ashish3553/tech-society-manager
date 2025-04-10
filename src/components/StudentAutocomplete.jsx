// src/components/StudentAutocomplete.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function StudentAutocomplete({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query) {
        setSuggestions([]);
        return;
      }
      try {
        // Adjust the endpoint as needed to search students
        const res = await api.get(`/users/students?search=${encodeURIComponent(query)}`);
        setSuggestions(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Type student name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded p-2"
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 border rounded mt-1 max-h-60 overflow-auto z-10">
          {suggestions.map((student) => (
            <li
              key={student._id}
              className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
              onClick={() => {
                onSelect(student);
                setQuery('');
                setSuggestions([]);
              }}
            >
              <div className="ml-2">
                <p className="font-semibold">{student.name}</p>
                <p className="text-xs text-gray-600">{student.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentAutocomplete;
