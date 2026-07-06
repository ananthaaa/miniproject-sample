
import { motion } from 'framer-motion';
import { Sun, Moon, LogOut, MapPin, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export function Navbar({ title = 'CampusPulse', subtitle }: NavbarProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: 60,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 16,
      position: 'relative',
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 34, height: 34,
          background: 'linear-gradient(135deg, #0066ff, #0052cc)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,102,255,0.3)',
        }}>
          <MapPin size={18} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User badge */}
      {user && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-primary)',
          borderRadius: 10,
          padding: '6px 12px',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{
            width: 26, height: 26,
            background: user.role === 'admin'
              ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
              : 'linear-gradient(135deg, #0066ff, #0052cc)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={14} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {user.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {user.role}
            </div>
          </div>
        </div>
      )}

      {/* Dark mode toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        style={{
          width: 36, height: 36,
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
        }}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </motion.button>

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        style={{
          width: 36, height: 36,
          background: '#fee2e2',
          border: 'none',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: '#dc2626',
        }}
        title="Logout"
      >
        <LogOut size={16} />
      </motion.button>
    </header>
  );
}
