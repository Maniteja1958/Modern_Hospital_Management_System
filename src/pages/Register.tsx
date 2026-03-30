import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../lib/api';
import { UserPlus, HeartPulse, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';

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
      const res = await fetch(getApiUrl('/auth/register'), {
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

  const inputClass = "w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm";
  const selectClass = "w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm appearance-none select-bg-arrow";
  const labelClass = "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block px-1";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-sans">
      
      {/* Left Column: Premium Graphic */}
      <div className="hidden lg:flex relative bg-primary/5 overflow-hidden flex-col justify-center p-12 border-r border-border/50">
        <div className="absolute top-10 left-10 flex items-center gap-2">
          <HeartPulse className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">PharmaCare</span>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 right-0 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-1/4 left-0 -translate-x-1/4 w-96 h-96 bg-success/20 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
        
        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-start space-y-8">
          <div className="p-4 bg-background border border-border rounded-2xl shadow-sm">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-foreground leading-tight">Join the network of modern healthcare.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Create an account in seconds to access secure digital prescriptions, rapid appointment scheduling, and direct messaging with verified doctors.
          </p>
          
          <div className="pt-8 border-t border-border/50 w-full flex gap-12 text-sm font-semibold text-muted-foreground">
            <div>
              <p className="text-foreground text-3xl font-bold mb-1">10k+</p>
              <p>Active Patients</p>
            </div>
            <div>
              <p className="text-foreground text-3xl font-bold mb-1">500+</p>
              <p>Verified Doctors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form Content */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 xl:px-32 h-full py-12 z-10 mx-auto w-full max-w-[600px] lg:max-w-none bg-background">
        <div className="w-full max-w-lg mx-auto">
          
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <HeartPulse className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">PharmaCare</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <UserPlus className="w-7 h-7 text-primary" /> Create Account
            </h1>
            <p className="text-muted-foreground text-sm">Register a new profile to get started.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>First Name</label>
                <input type="text" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className={labelClass}>Email Address</label>
                <input type="email" name="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} required className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className={labelClass}>Phone Number</label>
                <input type="tel" name="phoneNumber" placeholder="+1 (555) 000-0000" value={formData.phoneNumber} onChange={handleChange} required className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className={labelClass}>Secure Password</label>
                <input type="password" name="password" placeholder="Min 8 characters" value={formData.password} onChange={handleChange} required className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
               <label className={labelClass}>Gender</label>
                <div className="relative">
                  <select name="gender" value={formData.gender} onChange={handleChange} className={selectClass}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>System Role</label>
                <div className="relative">
                  <select name="role" value={formData.role} onChange={handleChange} className={`${selectClass} border-primary/40 bg-primary/5`}>
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 rounded-xl text-base font-semibold shadow-md active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Finalizing Profile...
                  </span>
                ) : 'Complete Registration'}
              </Button>
            </div>
          </form>

          <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4">
              Sign In here
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;
