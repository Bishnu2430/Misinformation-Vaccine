import React from "react";
import { Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-serif font-bold text-primary-800 mb-2">
              Misinformation Vaccine
            </h3>
            <p className="text-sm text-gray-600">
              AI-powered fake news detection to help you verify information and
              combat misinformation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="/analyze"
                  className="hover:text-primary-700 transition-colors"
                >
                  Analyze Article
                </a>
              </li>
              <li>
                <a
                  href="/history"
                  className="hover:text-primary-700 transition-colors"
                >
                  History
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-primary-700 transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-primary-700 transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Connect</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-600 hover:text-primary-700 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © {currentYear} Misinformation Vaccine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
