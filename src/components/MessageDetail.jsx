// src/components/MessageDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

function MessageDetail() {
  const { id } = useParams();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await api.get(`/messages/${id}`);
        setMessage(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch message details.');
      }
    };
    fetchMessage();
  }, [id]);

  if (!message) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <Link to="/messages" className="text-blue-500 underline">Back to Messages</Link>
      <div className="bg-white p-6 rounded shadow-md mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">{message.subject}</h2>
          <span className={`px-3 py-1 rounded-full text-sm ${message.isPublic ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
            {message.isPublic ? 'Public' : 'Personal'}
          </span>
        </div>
        <p className="mt-4 text-gray-800">{message.body}</p>

        {message.links && message.links.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Links:</h3>
            <ul className="list-disc list-inside">
              {message.links.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 border-t pt-4">
          <p><strong>From:</strong> {message.sender.name} ({message.sender.email})</p>
          {message.isPublic ? (
            <p><strong>To:</strong> Global</p>
          ) : (
            <div>
              <p className="font-semibold">To:</p>
              <ul className="list-disc list-inside">
                {message.recipients.map((r) => (
                  <li key={r._id}>
                    {r.name} ({r.email})
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">Date: {new Date(message.createdAt).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}

export default MessageDetail;
