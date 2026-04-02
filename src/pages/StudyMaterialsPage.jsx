import React from 'react';
import { Book, Cpu } from 'lucide-react';

const StudyMaterialsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-8 shadow-lg text-white flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study Materials</h1>
          <p className="text-teal-100 text-lg">Access resources and ask our AI assistant for help.</p>
        </div>
        <Book size={64} className="opacity-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass-panel p-8 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Book size={48} className="text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Course Materials</h2>
          <p className="text-gray-500 mt-2">No materials have been uploaded yet.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-sm border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 flex flex-col min-h-[300px] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-indigo-100">
            <Cpu size={150} />
          </div>
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <span>AI Assistant Beta</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Need help studying?</h2>
              <p className="text-gray-600 mb-6">Ask questions, summarize notes, or get explanations for complex topics using our OpenAI-powered assistant.</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="w-full px-4 py-2 bg-transparent focus:outline-none text-gray-700"
                disabled
              />
              <div className="mt-2 text-xs text-gray-400 text-center">
                * OpenAI API key required to activate this feature
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialsPage;
