// src/pages/Contact.jsx
import React from 'react';
import ContactForm from '../components/ContactForm';
import AboutSection from '../components/AboutSection';



function Contact() {
  return (
    <div className="mx-auto bg-color p-4 max-w-7xl">
      {/* <h1 className="text-4xl font-bold text-center my-8 text-gray-800">Contact Us</h1> */}
      
      {/* Two column layout for larger screens */}
      <div className="grid gap-8">
        {/* Contact Form */}
        <div className="lg:order-2">
          <ContactForm />
        </div>
        
        {/* About Section */}
        <div className="w-full">
          <AboutSection />
        </div>
      </div>
    </div>
  );
}

export default Contact;
