import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    gender: 'Male',
    role: 'Patient',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

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

  const inputStyle = { width: '100%', padding: '12px', backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '8px', fontSize: '15px', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '13px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '500' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#18181b', fontFamily: "'Inter', sans-serif", padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '600px', padding: '40px', backgroundColor: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#10b981', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
            <UserPlus color="white" size={32} />
          </div>
          <h2 style={{ color: '#f4f4f5', fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>Join the System</h2>
          <p style={{ color: '#a1a1aa', fontSize: '15px', margin: 0 }}>Register a new account</p>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#ef444420', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div>
            <label style={labelStyle}>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Secure Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Role Assignment</label>
            <select name="role" value={formData.role} onChange={handleChange} style={{ ...inputStyle, border: '1px solid #3b82f6', backgroundColor: '#1e3a8a20' }}>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Admin">System Admin</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '12px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#a1a1aa', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#10b981', fontWeight: '500', textDecoration: 'none' }}>Sign In here</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
