// src/pages/Contact.jsx
import React from 'react';
import ContactForm from '../components/ContactForm';
import AboutSection from '../components/AboutSection';



function Contact() {
  return (
    <div className="mx-auto bg-color p-4 max-w-7xl">
      {/* <h1 className="text-4xl font-bold text-center my-8 text-gray-800">Contact Us</h1> */}

      {/* Two column layout for larger screens */}
      <div className="grid grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="lg:order-2">
          <ContactForm />
        </div>
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">Quick Contact</h3>
            <div className="space-y-2 text-gray-400">
              <p>General Inquiries: info@codeindia.fun</p>
              <p>Support: support@codeindia.fun</p>
              <p>Phone: +91 123-456-7890</p>
            </div>
          </div>
          {/* officialtechsocietypussgrc@gmail.com */}

        {/* About Section */}
        {/* <div className="w-full">
          <AboutSection />
        </div> */}
      </div>
    </div>
  );
}

export default Contact;
