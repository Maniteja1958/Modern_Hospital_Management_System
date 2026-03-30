import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound } from 'lucide-react';
import { getApiUrl } from '../lib/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to generate reset link');

      // For local testing, the backend provides the token. Normally this comes via email.
      if (data.resetToken) {
        alert("Simulated Email Sent! Redirecting to the secure reset page.");
        navigate(`/reset-password?token=${data.resetToken}`);
      }

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
          <div style={{ width: '56px', height: '56px', backgroundColor: '#eab308', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 10px 15px -3px rgba(234, 179, 8, 0.3)' }}>
            <KeyRound color="white" size={32} />
          </div>
          <h2 style={{ color: '#f4f4f5', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0', textAlign: 'center' }}>Recover Password</h2>
          <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0, textAlign: 'center' }}>Enter your email address and we'll send you a secure link to reset your password.</p>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ position: 'relative' }}>
            <Mail size={18} color="#a1a1aa" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input 
              type="email" 
              placeholder="Registered Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 12px 12px 42px', backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#eab308'}
              onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', backgroundColor: '#eab308', color: '#18181b', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px', boxShadow: '0 4px 6px -1px rgba(234, 179, 8, 0.2)', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#facc15')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#eab308')}
          >
            {loading ? 'Processing...' : 'Send Recovery Link'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#a1a1aa', fontSize: '14px' }}>
          Return to <Link to="/login" style={{ color: '#eab308', fontWeight: '500', textDecoration: 'none' }}>Login</Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;
