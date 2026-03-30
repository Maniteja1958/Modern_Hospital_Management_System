import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import { getApiUrl } from '../lib/api';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!token) {
      return setError('Authentication Token is missing. Please restart the forgot password process.');
    }

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken: token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');

      setSuccess('Your password has been successfully reset!');
      setTimeout(() => navigate('/login'), 2500);

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
          <div style={{ width: '56px', height: '56px', backgroundColor: '#10b981', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
            <ShieldCheck color="white" size={32} />
          </div>
          <h2 style={{ color: '#f4f4f5', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0', textAlign: 'center' }}>Create New Password</h2>
          <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0, textAlign: 'center' }}>Your new password must be securely encrypted.</p>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ padding: '12px', backgroundColor: '#10b98120', border: '1px solid #10b981', color: '#10b981', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{success}<br/><br/>Redirecting to Login...</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#a1a1aa" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input 
              type="password" 
              placeholder="New Secure Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 12px 12px 42px', backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="#a1a1aa" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 12px 12px 42px', backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !!success}
            style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: (loading || success) ? 'not-allowed' : 'pointer', marginTop: '8px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
          >
            {loading ? 'Encrypting...' : 'Reset My Password'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;
