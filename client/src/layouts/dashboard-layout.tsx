import { useState } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router';
import { useAuth } from '../providers/auth-provider';
import { useTheme } from '../providers/theme-provider';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  User as UserIcon,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Shield,
  Layers,
  FileSearch,
} from 'lucide-react';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Compute navigation options based on user role
  const navItems = (() => {
    if (!user) return [];
    if (user.role === 'admin') {
      return [
        { label: 'Admin Dashboard', path: '/admin/dashboard', icon: Shield },
        { label: 'All Requests', path: '/admin/requests', icon: FileSearch },
      ];
    }
    if (user.role === 'runner') {
      return [
        { label: 'Dashboard', path: '/runner/dashboard', icon: LayoutDashboard },
        { label: 'Browse Jobs', path: '/runner/jobs', icon: Briefcase },
        { label: 'Profile', path: '/runner/profile', icon: UserIcon },
      ];
    }
    // Default Expat
    return [
      { label: 'Dashboard', path: '/expat/dashboard', icon: LayoutDashboard },
      { label: 'My Requests', path: '/expat/requests', icon: FileText },
      { label: 'Profile', path: '/expat/profile', icon: UserIcon },
    ];
  })();

  const activeItem = navItems.find((item) => location.pathname === item.path) || navItems[0];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0b0c10] flex flex-col md:flex-row transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#13141b] border-r border-neutral-200 dark:border-neutral-800 p-4">
        {/* Brand */}
        <div className="flex items-center gap-2 px-2 py-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
          <Layers className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">WodaLink</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800/40'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-2">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800/40"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>

          {/* User Info */}
          {user && (
            <div className="px-3 py-2 flex flex-col">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{user.role}</span>
              <span className="text-sm font-bold text-neutral-950 dark:text-neutral-50 truncate">{user.name}</span>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sticky Header */}
      <header className="md:hidden flex items-center justify-between bg-white dark:bg-[#13141b] border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-bold text-neutral-900 dark:text-white">WodaLink</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-neutral-600 dark:text-neutral-300"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-64 max-w-sm h-full bg-white dark:bg-[#13141b] flex flex-col p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
              <span className="text-lg font-bold text-neutral-900 dark:text-white">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5 text-neutral-500" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {activeItem?.label || 'WodaLink'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Role: <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize">{user?.role}</span>
            </p>
          </div>
        </div>

        {/* Route Outlet */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
