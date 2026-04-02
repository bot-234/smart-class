import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ClipboardList, PenTool, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  const actions = [
    { title: 'View Notices', icon: <ClipboardList size={32} />, path: '/notices', color: 'bg-blue-100 text-blue-600', desc: 'Check latest announcements' },
    { title: 'My Assignments', icon: <PenTool size={32} />, path: '/assignments', color: 'bg-green-100 text-green-600', desc: 'Submit and view pending tasks' },
    { title: 'Attendance Record', icon: <User size={32} />, path: '/attendance', color: 'bg-orange-100 text-orange-600', desc: 'View your attendance history' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">Hello, {user?.name}!</h1>
        <p className="text-blue-100 text-lg">Stay updated with your coursework and academic progress.</p>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Your Portal</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, idx) => (
          <Link to={action.path} key={idx}>
            <div className="glass-panel p-6 rounded-2xl shadow-sm border border-white hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col items-start space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                {React.cloneElement(action.icon, { size: 100 })}
              </div>
              <div className={`p-3 rounded-xl ${action.color} relative z-10`}>
                {action.icon}
              </div>
              <div className="relative z-10">
                <h3 className="font-semibold text-gray-800 text-lg">{action.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{action.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
