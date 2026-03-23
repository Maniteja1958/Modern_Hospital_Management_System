import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      login(data);

      if (data.role === 'Admin') navigate('/dashboard/admin');
      else if (data.role === 'Doctor') navigate('/dashboard/doctor');
      else navigate('/dashboard/patient');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#18181b', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '40px', backgroundColor: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}>
            <Activity color="white" size={32} />
          </div>
          <h2 style={{ color: '#f4f4f5', fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Welcome Back</h2>
          <p style={{ color: '#a1a1aa', fontSize: '15px', margin: 0 }}>Sign in to the Smart Hospital System</p>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#a1a1aa" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 12px 12px 42px', backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#a1a1aa" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 12px 12px 42px', backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
            <Link to="/forgot-password" style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Loader2 size={18} className="spin-slow" /> Authenticating...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#a1a1aa', fontSize: '14px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#3b82f6', fontWeight: '500', textDecoration: 'none' }}>Create one now</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
