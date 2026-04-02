import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { UserCheck, UserX } from 'lucide-react';

const AttendancePage = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [markData, setMarkData] = useState({ studentId: '', subjectId: '', date: new Date().toISOString().split('T')[0], status: 'Present' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';

  useEffect(() => {
    if (isStudent) {
      fetchMyAttendance();
    } else if (isTeacher) {
      fetchTeacherData();
    }
  }, [user]);

  const fetchMyAttendance = async () => {
    try {
      const res = await api.get(`/attendance/${user.id}`);
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeacherData = async () => {
    try {
      const [uRes, sRes] = await Promise.all([
        api.get('/users/students'),
        api.get('/subjects')
      ]);
      const st = uRes.data;
      const sub = sRes.data.filter(s => s.teacher.id === user.id);

      setStudents(st);
      setSubjects(sub);

      if (st.length > 0 && sub.length > 0) {
        setMarkData(prev => ({ ...prev, studentId: st[0].id, subjectId: sub[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/attendance', markData);
      setMessage({ type: 'success', text: 'Attendance marked!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to mark attendance' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Attendance</h1>

      {isTeacher && (
        <div className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
          <h2 className="text-lg font-semibold mb-6 border-b pb-2">Mark Student Attendance</h2>

          {message && (
            <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleMarkAttendance} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
              <select
                required
                value={markData.studentId}
                onChange={(e) => setMarkData({ ...markData, studentId: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                required
                value={markData.subjectId}
                onChange={(e) => setMarkData({ ...markData, subjectId: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {subjects.map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={markData.date}
                onChange={(e) => setMarkData({ ...markData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                required
                value={markData.status}
                onChange={(e) => setMarkData({ ...markData, status: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Attendance'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isStudent && (
        <div className="glass-panel rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold">My Attendance Record</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{att.date}</td>
                    <td className="px-6 py-4 text-gray-600">{att.subject?.subjectName}</td>
                    <td className="px-6 py-4">
                      {att.status === 'Present' ? (
                        <span className="inline-flex items-center text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full"><UserCheck size={16} className="mr-1" /> Present</span>
                      ) : (
                        <span className="inline-flex items-center text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full"><UserX size={16} className="mr-1" /> Absent</span>
                      )}
                    </td>
                  </tr>
                ))}
                {attendance.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No attendance records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
