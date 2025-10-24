import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Shield, DollarSign, CreditCard, FileText, Users, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');
    
    if (!adminToken || !adminData) {
      navigate('/admin/login');
      return;
    }
    
    setAdmin(JSON.parse(adminData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <Shield className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/admin/pricing', icon: <DollarSign className="w-5 h-5" />, label: 'Pricing Plans' },
    { path: '/admin/payment', icon: <CreditCard className="w-5 h-5" />, label: 'Payment Settings' },
    { path: '/admin/seo', icon: <FileText className="w-5 h-5" />, label: 'SEO Settings' },
    { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
  ];

  if (!admin) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg">Admin Portal</div>
              <div className="text-xs text-gray-400">{admin.username}</div>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;