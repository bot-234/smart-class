import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BookOpen, PlusCircle } from 'lucide-react';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [newSubject, setNewSubject] = useState({ subjectName: '', teacherId: '', branch: '', year: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [subRes, usersRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/admin/users')
      ]);
      setSubjects(subRes.data);
      setTeachers(usersRes.data.filter(u => u.role === 'TEACHER'));
      if (usersRes.data.filter(u => u.role === 'TEACHER').length > 0 && !newSubject.teacherId) {
          setNewSubject(prev => ({ ...prev, teacherId: usersRes.data.filter(u => u.role === 'TEACHER')[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/subjects', newSubject);
      setMessage({ type: 'success', text: res.data.message });
      setNewSubject({ subjectName: '', teacherId: teachers[0]?.id || '', branch: '', year: '' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create subject' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Subjects</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Subject Form */}
        <div className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 h-fit">
          <div className="flex items-center space-x-2 mb-6">
            <PlusCircle className="text-indigo-600" />
            <h2 className="text-lg font-semibold">New Subject</h2>
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleCreateSubject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={newSubject.subjectName}
                onChange={(e) => setNewSubject({...newSubject, subjectName: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Teacher</label>
              <select
                required
                value={newSubject.teacherId}
                onChange={(e) => setNewSubject({...newSubject, teacherId: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {teachers.length === 0 && <option value="">No teachers available</option>}
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input
                type="text"
                required
                value={newSubject.branch}
                onChange={(e) => setNewSubject({...newSubject, branch: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                required
                value={newSubject.year}
                onChange={(e) => setNewSubject({...newSubject, year: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 2nd Year"
              />
            </div>
            <button
              type="submit"
              disabled={loading || teachers.length === 0}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Subject'}
            </button>
          </form>
        </div>

        {/* Subjects List */}
        <div className="glass-panel rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden flex flex-col h-fit">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="text-indigo-600" />
              <h2 className="text-lg font-semibold">Subject Catalog</h2>
            </div>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {subjects.length} Total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium">Teacher</th>
                  <th className="px-6 py-4 font-medium">Branch</th>
                  <th className="px-6 py-4 font-medium">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{sub.subjectName}</td>
                    <td className="px-6 py-4 text-gray-700">{sub.teacher?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sub.branch}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sub.year}</td>
                  </tr>
                ))}
                {subjects.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No subjects assigned yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;
