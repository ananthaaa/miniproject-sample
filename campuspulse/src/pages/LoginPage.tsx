import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Lock, Eye, EyeOff, AlertCircle, GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Tab = 'student' | 'admin';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Tab>('student');
  const [email, setEmail] = useState('student@campuspulse.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setError('');
    setEmail(tab === 'student' ? 'student@campuspulse.com' : 'admin@campuspulse.com');
    setPassword('123456');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        const stored = JSON.parse(localStorage.getItem('campuspulse_auth') || '{}');
        navigate(stored.role === 'admin' ? '/admin' : '/student', { replace: true });
      } else {
        setError('Invalid email or password. Try the demo credentials shown below.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabConfig = {
    student: { label: 'Student', icon: GraduationCap, color: '#0066ff', hint: 'student@campuspulse.com' },
    admin:   { label: 'Admin',   icon: Shield,          color: '#6366f1', hint: 'admin@campuspulse.com' },
  };
  const active = tabConfig[activeTab];
  const ActiveIcon = active.icon;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #060d1a 0%, #0a1628 40%, #0d2040 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 440, zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            style={{
              width: 72, height: 72,
              background: 'linear-gradient(135deg, #0066ff, #0052cc)',
              borderRadius: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 32px rgba(0,102,255,0.4)',
            }}
          >
            <MapPin size={36} color="white" />
          </motion.div>
          <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            CampusPulse
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>
            Campus Navigation System
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', padding: '20px 20px 0' }}>
            {(['student', 'admin'] as Tab[]).map((tab) => {
              const cfg = tabConfig[tab];
              const Ico = cfg.icon;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    borderRadius: 14,
                    cursor: 'pointer',
                    background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.4)',
                    fontWeight: 700,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                  }}
                >
                  <Ico size={16} />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = active.color; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    borderRadius: 12,
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = active.color; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <AlertCircle size={14} color="#ef4444" />
                  <span style={{ color: '#ef4444', fontSize: 13 }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              style={{
                width: '100%',
                padding: '14px',
                background: isLoading
                  ? 'rgba(255,255,255,0.1)'
                  : `linear-gradient(135deg, ${active.color}, ${active.color}cc)`,
                border: 'none',
                borderRadius: 14,
                color: 'white',
                fontSize: 15,
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'Inter, sans-serif',
                boxShadow: isLoading ? 'none' : `0 4px 20px ${active.color}50`,
                transition: 'all 0.2s',
              }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  <ActiveIcon size={16} />
                  Sign in as {active.label}
                </>
              )}
            </motion.button>

            {/* Demo hint */}
            <div style={{
              marginTop: 20,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                Demo Credentials
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                <div>📧 {active.hint}</div>
                <div>🔑 Password: <code style={{ color: 'rgba(255,255,255,0.8)' }}>123456</code></div>
              </div>
            </div>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 24 }}>
          CampusPulse Navigator v1.0 MVP
        </p>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
