import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PenTool,
  FileText,
  LineChart,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { GiCow } from 'react-icons/gi';
import { useState, useEffect } from 'react';

const NavLink = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === to;
  
  return (
    <Link
      href={to}
      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive
          ? 'bg-green-600/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'}`}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
};

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'light' : 'dark';
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/cattlefarmmanagement" className="flex items-center space-x-2">
            <GiCow className="h-6 w-6 text-green-600 dark:text-green-500" />
            <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-500 dark:to-green-300 bg-clip-text text-transparent">
              Cattle Farm Management
            </span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <NavLink to="/cattlefarmmanagement" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink to="/cattlefarmmanagement/cows" icon={GiCow}>Cows</NavLink>
            <NavLink to="/cattlefarmmanagement/data-entry" icon={PenTool}>Milk Data</NavLink>
            <NavLink to="/cattlefarmmanagement/reports" icon={FileText}>Reports</NavLink>
            <NavLink to="/cattlefarmmanagement/analytics" icon={LineChart}>Analytics</NavLink>
            
            <div className="border-l border-gray-200 dark:border-gray-700 h-5 mx-2" />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            <div className="flex flex-col space-y-1 px-2">
              <NavLink to="/cattlefarmmanagement" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink to="/cattlefarmmanagement/cows" icon={GiCow}>Cows</NavLink>
              <NavLink to="/cattlefarmmanagement/data-entry" icon={PenTool}>Milk Data</NavLink>
              <NavLink to="/cattlefarmmanagement/reports" icon={FileText}>Reports</NavLink>
              <NavLink to="/cattlefarmmanagement/analytics" icon={LineChart}>Analytics</NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;