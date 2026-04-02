import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { PenTool, PlusCircle } from 'lucide-react';

const AssignmentsPage = () => {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', subjectId: '', dueDate: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAssignments = async (subId) => {
    try {
      const url = subId ? `/assignments?subjectId=${subId}` : '/assignments';
      const res = await api.get(url);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      // Teachers only see their subjects, admin/students see all
      const sub = res.data;
      const filtered = user.role === 'TEACHER' ? sub.filter(s => s.teacher.id === user.id) : sub;
      setSubjects(filtered);
      if (filtered.length > 0) {
        setNewAssignment(prev => ({ ...prev, subjectId: filtered[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchAssignments();
  }, [user]);

  const handleFilterChange = (e) => {
    setSelectedSubjectId(e.target.value);
    fetchAssignments(e.target.value);
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/assignments', newAssignment);
      setMessage({ type: 'success', text: 'Assignment created!' });
      setNewAssignment(prev => ({ ...prev, title: '', description: '', dueDate: '' }));
      fetchAssignments(selectedSubjectId);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create assignment' });
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = user?.role === 'TEACHER';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Assignments</h1>
        <select
          className="border border-gray-200 rounded-xl px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
          value={selectedSubjectId}
          onChange={handleFilterChange}
        >
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Assignments List */}
        <div className={`glass-panel rounded-2xl shadow-sm border border-gray-100 ${isTeacher ? 'lg:col-span-2' : 'lg:col-span-3'} p-6`}>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <PenTool size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{assignment.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{assignment.description}</p>
                    <div className="mt-3 flex space-x-3 text-xs font-semibold text-gray-400">
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-600">Subject: {assignment.subject?.subjectName}</span>
                      <span className={`px-2 py-1 rounded-md ${new Date(assignment.dueDate) < new Date() ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {assignments.length === 0 && (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No assignments found for the selected subject.
              </div>
            )}
          </div>
        </div>

        {/* Create Assignment Form */}
        {isTeacher && (
          <div className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center space-x-2 mb-6">
              <PlusCircle className="text-purple-600" />
              <h2 className="text-lg font-semibold">New Assignment</h2>
            </div>

            {message && (
              <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  required
                  value={newAssignment.subjectId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="" disabled>Select Subject</option>
                  {subjects.map(t => (
                    <option key={t.id} value={t.id}>{t.subjectName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || subjects.length === 0}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
