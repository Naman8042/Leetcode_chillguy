"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Call to Action */}
        <div className="text-center md:text-left pb-8 border-b border-gray-700 flex justify-center gap-8">
          <div className="">
            <h2 className="text-3xl md:text-4xl font-bold">
              Build smarter, code cleaner, and grow faster 🚀
            </h2>
            <p className="text-gray-400 mt-3">
              From resume building to live code analysis, Recrute helps you grow technically and professionally.
            </p>
          </div>

  
          
        </div>

        {/* Footer Content */}
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold">Leetcode Analyser</h3>
            <p className="text-gray-400 mt-2">
              Empowering developers with tools to code, analyze, and succeed in interviews and beyond.
            </p>
            <div className="flex gap-4 mt-4">
              <FaFacebookF className="text-gray-400 hover:text-white cursor-pointer" size={20} />
              <FaTwitter className="text-gray-400 hover:text-white cursor-pointer" size={20} />
              <FaInstagram className="text-gray-400 hover:text-white cursor-pointer" size={20} />
              <FaLinkedin className="text-gray-400 hover:text-white cursor-pointer" size={20} />
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h4 className="text-lg font-semibold">Features</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="/resume" className="text-gray-400 hover:text-white">Resume Builder</a></li>
              <li><a href="/codesnippet" className="text-gray-400 hover:text-white">Code Snippet Saver</a></li>
              <li><a href="/code" className="text-gray-400 hover:text-white">Recursion Tree Visualizer</a></li>
              <li><a href="/compare" className="text-gray-400 hover:text-white">Compare</a></li>
              <li><a href="/execution" className="text-gray-400 hover:text-white">Execution Flow</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold">Get in Touch</h4>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>📍 8708 Technology Forest, TX 773</li>
              <li>✉️ support@recrute.dev</li>
              <li>📞 +1 123-456-7890</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
