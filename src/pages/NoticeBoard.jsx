import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, PlusCircle } from 'lucide-react';

const NoticeBoard = () => {
  const { user } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePostNotice = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/notices', newNotice);
      setMessage({ type: 'success', text: 'Notice posted successfully!' });
      setNewNotice({ title: '', description: '' });
      fetchNotices();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to post notice' });
    } finally {
      setLoading(false);
    }
  };

  const canPost = user?.role === 'ADMIN' || user?.role === 'TEACHER';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Virtual Notice Board</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Notices Timeline */}
        <div className={`glass-panel rounded-2xl shadow-sm border border-gray-100 ${canPost ? 'lg:col-span-2' : 'lg:col-span-3'} p-6`}>
          <h2 className="text-lg font-semibold mb-6 flex items-center"><Calendar className="mr-2 text-indigo-600" /> Recent Announcements</h2>

          <div className="space-y-6">
            {notices.map((notice) => (
              <div key={notice.id} className="relative pl-8 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-indigo-100">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-indigo-100 border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{notice.title}</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      {new Date(notice.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{notice.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-500 flex items-center">
                    Posted by <span className="font-semibold text-indigo-600 ml-1">{notice.createdBy?.name || 'Admin'}</span>
                  </div>
                </div>
              </div>
            ))}

            {notices.length === 0 && (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No recent notices found.
              </div>
            )}
          </div>
        </div>

        {/* Post Notice Form (Hidden for Students) */}
        {canPost && (
          <div className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center space-x-2 mb-6">
              <PlusCircle className="text-indigo-600" />
              <h2 className="text-lg font-semibold">Post a Notice</h2>
            </div>

            {message && (
              <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handlePostNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Exam Schedule"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows="5"
                  value={newNotice.description}
                  onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Details of the announcement..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                {loading ? 'Posting...' : 'Publish Notice'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
