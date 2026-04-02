import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ClipboardList, PenTool, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { title: 'Post Notice', icon: <ClipboardList size={32} />, path: '/notices', color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Create Assignment', icon: <PenTool size={32} />, path: '/assignments', color: 'bg-purple-100 text-purple-600' },
    { title: 'Mark Attendance', icon: <User size={32} />, path: '/attendance', color: 'bg-teal-100 text-teal-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Professor {user?.name}!</h1>
        <p className="text-indigo-100 text-lg">Manage your classes, assignments, and students from your dashboard.</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Link to={stat.path} key={idx}>
            <div className="glass-panel p-6 rounded-2xl shadow-sm border border-white hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center text-center space-y-4">
              <div className={`p-4 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">{stat.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
