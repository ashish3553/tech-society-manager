// src/components/ContactForm.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

function ContactForm() {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      toast.warning('All fields are required.');
      return;
    }
    try {
      await api.post('/contact', contactData);
      toast.success('Your message has been sent!');
      setSubmitted(true);
      setContactData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send your message.');
    }
  };

  return (
    <div className="p-4 bg-color bg-gray-100">
      <h2 className="text-lg font-bold mb-2">Contact Us</h2>
      {submitted ? (
        <p className="text-green-600">Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border rounded"
            value={contactData.name}
            onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-2 border rounded"
            value={contactData.email}
            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
            required
          />
          <textarea
            placeholder="Your Message"
            className="w-full p-2 border rounded"
            value={contactData.message}
            onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}

export default ContactForm;
