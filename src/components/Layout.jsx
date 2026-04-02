import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, User, BookOpen, ClipboardList, PenTool } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = {
    ADMIN: [
      { name: 'Dashboard', path: '/admin-dashboard', icon: <Home size={20} /> },
      { name: 'Subjects', path: '/subjects', icon: <BookOpen size={20} /> }, // Admin manages subjects
      { name: 'Notices', path: '/notices', icon: <ClipboardList size={20} /> },
    ],
    TEACHER: [
      { name: 'Dashboard', path: '/teacher-dashboard', icon: <Home size={20} /> },
      { name: 'Notices', path: '/notices', icon: <ClipboardList size={20} /> },
      { name: 'Assignments', path: '/assignments', icon: <PenTool size={20} /> },
      { name: 'Attendance', path: '/attendance', icon: <User size={20} /> },
      { name: 'Study Materials', path: '/materials', icon: <BookOpen size={20} /> },
    ],
    STUDENT: [
      { name: 'Dashboard', path: '/student-dashboard', icon: <Home size={20} /> },
      { name: 'Notices', path: '/notices', icon: <ClipboardList size={20} /> },
      { name: 'Assignments', path: '/assignments', icon: <PenTool size={20} /> },
      { name: 'Attendance', path: '/attendance', icon: <User size={20} /> },
      { name: 'Study Materials', path: '/materials', icon: <BookOpen size={20} /> },
    ],
  };

  const links = user ? navItems[user.role] || [] : [];

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r shadow-sm hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-indigo-100 bg-white/50">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">SmartClass</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-indigo-100 bg-white/40">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 glass-panel border-b shadow-sm flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="md:hidden flex items-center">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">SmartClass</h1>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline font-medium text-sm">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/30 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
