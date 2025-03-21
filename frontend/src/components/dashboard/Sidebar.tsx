
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileEdit, 
  Users, 
  CheckSquare, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  BarChart
} from 'lucide-react';
import OpenBallotLogo from '../OpenBallotLogo';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileEdit, label: 'Create Election', path: '/create-election' },
    { icon: Users, label: 'Add Candidates', path: '/add-candidates' },
    { icon: CheckSquare, label: 'Review & Finalize', path: '/review-election' },
    { icon: BarChart, label: 'Results', path: '/results' },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`h-screen border-r border-border bg-white flex flex-col transition-all duration-300 ${
      collapsed ? 'w-[80px]' : 'w-[280px]'
    }`}>
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        {!collapsed && <OpenBallotLogo size="sm" />}
        {collapsed && <div className="flex mx-auto">
          <div className="h-5 w-1 bg-ghana-red rounded-sm"></div>
          <div className="h-5 w-1 bg-ghana-gold rounded-sm ml-0.5"></div>
          <div className="h-5 w-1 bg-ghana-green rounded-sm ml-0.5"></div>
        </div>}
        <button
          onClick={toggleSidebar}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive 
                    ? 'bg-ghana-red text-white' 
                    : 'text-gray-700 hover:bg-secondary'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-3 border-t border-border">
        <Link
          to="/login"
          className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-secondary transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;